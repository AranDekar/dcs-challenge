module.exports = function redirectToCurrentCropImplementation() {
    /**
     * @ngdoc function
     * @name redirectToCorrectCrop
     *
     * @description
     * Redirects to the correct crop size for a particular image
     *
     * @param {object}   req   standard express/http request object
     * @param {object}   res   standard express/http response object
     *
     */

    var self = function redirectToCorrectCrop(req, res) {
        var query = res.locals.query,
            data = res.locals.data,
            height = query.height,
            width = query.width,
            validCrops,
            redirectTo;

        if (!data.results || !data.results.length) {
            return self.write404(res,
                'No images with this sourceId were found.');
        }

        // Filter valid crops by width

        validCrops = data.results.filter(function(crop) {
            if (width && parseFloat(crop.width) !== parseFloat(width)) {
                return false;
            }

            return true;
        });

        if (!validCrops.length) {
            return self.write404(res,
                'No valid crop sizes for this image were found.');
        }

        // Sort valid crops by height difference
        if (height) {
            validCrops.sort(function(cropA, cropB) {
                var comparisonCropHeight = parseFloat(height);

                return (
                    Math.abs(parseFloat(cropA.height) - comparisonCropHeight) -
                    Math.abs(parseFloat(cropB.height) - comparisonCropHeight)
                );
            });
        }

        redirectTo = validCrops[0].link;

        if (!redirectTo) {
            return self.write404(res,
                'No valid link for this image crop was found.');
        }

        return res.redirect(301, redirectTo);
    };

    /**
     * @ngdoc function
     * @name write404
     *
     * @description
     * Write a 404 response, ending the request
     *
     * @param {object}  res     standard express/http response object
     * @param {string}  reason  why was a 404 generated
     *
     */

    self.write404 = function write404(res, reason) {
        res.writeHead(400, {
            'Content-type': 'application/json',
            'X-Reason': reason
        });

        res.end(JSON.stringify({
            code: 404,
            message: reason
        }));
    };

    return self;
};
