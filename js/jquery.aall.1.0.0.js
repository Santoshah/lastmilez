    $(function(){
    
        // Map country codes to TLD.
        var countryCodeToTLD = {
            "UK":   "co.uk",
            "GB":   "co.uk",
            "IE":   "co.uk",
            "DE":   "de",
            "AT":   "de",
            "FR":   "fr",            
            "US":   "com",
            "CA":   "ca",
            "JP":   "co.jp"            
        };
       
        // Map TLD to affiliate id.
        var TLDtoAffiliate = {
            "co.uk":    "profecloud-21",
            "de":       "profecloud0a-21",
            "fr":       "profecloud06-21",
            "com":      "profecloud-20",
            "ca":       "",
            "co.jp":    ""
        };
    
        var getCountryCode = function(callback) {
            $.ajax({
                url: "http://api.ipinfodb.com/v3/ip-country?format=json",
                dataType: "jsonp",
                data: {"key":"5e5c9212ee974dc59f859ad9e54647faf1c96ef00fcfdb9b17cbfb3fae4d1ef0"},
                success: function(data) {
                
                    if ( data.statusCode != 'OK') {
                        return null;
                    }
                    callback(data.countryCode);
                },
                error: function(data) {
                    return null;
                }
            });
        };
        
        var changeLinks = function(countryCode) {
            //alert(data.countryCode);
            var tld = countryCodeToTLD[countryCode];
            if(tld !== undefined) {
                var newTag = TLDtoAffiliate[tld];
                if(newTag !== '') {
                    $('.amz').each(function() {
                        var url = $(this).attr('href'),
                            tagStart =  url.indexOf('tag='),
                            tagEnd = url.indexOf('&',tagStart+1);
                            if(tagEnd==-1) tagEnd=url.length;
                            var tag = url.substring(tagStart+4,tagEnd),
                            urlStart =  url.indexOf('www.amazon'),
                            urlEnd = url.indexOf('/',urlStart+1),
                            amzSite = url.substring(urlStart,urlEnd);
                       
                        url = url.replace(amzSite,'www.amazon.' + tld);
                        url = url.replace(tag,newTag);
                        $(this).attr('href',url);                              
                    });
                }
            }
        };
        
        // If no cookie plugin or no cookie, then get the country code
        // from the server.
        if ( $.cookie === undefined || !$.cookie('AALL')) {
           
            getCountryCode(function(cCode){
                changeLinks(cCode);
                // Set the cookie if plugin exists.
                if ($.cookie !== undefined) {
                    $.cookie('AALL',cCode);
                }
            });
        // Cookie exists, so use the country code in it.
        }else {
            changeLinks($.cookie('AALL'));
        }
       
    });