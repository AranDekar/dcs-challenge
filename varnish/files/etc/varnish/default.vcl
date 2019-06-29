vcl 4.0;

import std;

backend default {
  .host = "127.0.0.1";
  .port = "8080";
}

sub vcl_hash {
    if (req.http.X-TCOG-TEMPLATE) { hash_data(req.http.X-TCOG-TEMPLATE); }
    if (req.http.X-TCOG-PRODUCT) { hash_data(req.http.X-TCOG-PRODUCT); }
}

sub vcl_recv {
    # sort query params to normalize urls to improve cache hits. e.g. /path?b=c&a=b -> /path?a=b&b=c
    set req.url = std.querysort(req.url);
    # remove query paramater. e.g. /path?nk=123 -> /path?
    set req.url = regsuball(req.url, "\?(nk=[^&? ]+)&?", "?");
    # remove query paramater. e.g. /path?a=b&nk=123 -> /path?a=b
    set req.url = regsuball(req.url, "&(nk=[^&? ]+)&?", "&");
    # remove trailing ampersand. e.g. /path?a=b& -> /path?a=b
    set req.url = regsub(req.url, "(&)$", "");
    # remove trailing question mark. e.g. /path? -> /path and /path?& -> /path
    set req.url = regsub(req.url, "(\?&?)$", "");
    # remove Cookie headers if present.
    if (req.http.Cookie) { unset req.http.Cookie; }

    # defines HTTP BAN API utilizing "X-Cache-Tags" header value to invalidate cache. e.g. curl -X BAN -H "X-Cache-Tags:C:123" <host>
    if (req.method == "BAN") {
        if (req.http.X-Cache-Tags) {
            ban("obj.http.X-Cache-Tags ~ " + req.http.X-Cache-Tags);
        } else {
            return (synth(403, "X-Cache-Tags header missing."));
        }

        return (synth(200, "Ban added."));
    }

    # does not cache any resource sent with a X-No-Cache header
    if (req.http.X-No-Cache) {
        return(pass);
    }

}

sub vcl_backend_response {
    if (beresp.http.content-type ~ "(text)|(json)") {
        set beresp.do_gzip = true;
    }
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }

    set resp.http.X-Cache-Hits = obj.hits;
}
