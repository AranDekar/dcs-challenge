/**
 * @ngdoc function
 * @name sandbox
 *
 * @description
 * Process a template in an isolated sandboxed scope via vm and return the result
 *
 * @param {object} clone smartClone - safe cloning of object prototypes
 * @param {object} vm    A reference to node-vm
 * @param {object} jade  A reference to a cloned version of the jade.runtime
 * @param {object} data  The data to pass to the view
 *
 * @returns {string}
 *
 */

function sandbox(clone, vmScript, jade, path, data) {
    var context = {
        jade: jade,
        data: clone(data)
    };

    vmScript.runInNewContext(context);

    return context.output;
}

module.exports = function(clone, vm, jade) {
    /**
     * @ngdoc function
     * @name createSandbox
     *
     * @description
     * Create an isolated sandboxed processor for processing templates
     *
     * @param {string} path  A path representing the view to process used only
     *                       for stack traces as per the node vm docs. Note no
     *                       code is loaded from this path.
     * @param {string} code  The code string to execute in the context of the vm
     *
     * @returns {function}
     *
     */

    function createSandbox(path, code) {
        var runtime = clone(jade.runtime),
            vmScript = new vm.Script(code, { filename: path });

        return sandbox.bind(null, clone, vmScript, runtime, path);
    }

    return createSandbox;
};
