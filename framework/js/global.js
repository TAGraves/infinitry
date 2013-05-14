(function ($, expose) {
    "use strict";
    var Infinitry = {
        
        cookie: {
            
            set: function (name, value, days) {
                var
                    date = new Date(),
                    expires;
                
                if (days) {
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expires = "; expires="+date.toGMTString();
                } else {
                    expires = "";
                }
                
                document.cookie = name+"="+value+expires+"; path=/";
            },
            
            get: function (name) {
                var 
                    nameEQ = name + "=",
                    ca = document.cookie.split(';'),
                    c,
                    i;
                
                for(i=0; i < ca.length; i++) { 
                    var c = ca[i];
                    
                    while (c.charAt(0)==' ') { 
                        c = c.substring(1,c.length);
                    }
                    
                    if (c.indexOf(nameEQ) == 0) {
                        return c.substring(nameEQ.length,c.length); 
                    }
                } 
                
                return null;
            },
            
            delete: function (name) {
                this.set(name, "", -1);
            }
        
        },
        
        randomString: function (length) {
            var 
                characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
                randomString = "", 
                randomNumber, 
                i;
            
            for (i = 0; i < length; i += 1) {
                randomNumber = Math.floor(Math.random() * characters.length);
                randomString += characters.substring(randomNumber,randomNumber+1);
            }
            
            return randomString;
        }
    };

    if (expose) {
        window.Infinitry = Infinitry;
    }
    
}(jQuery, true));