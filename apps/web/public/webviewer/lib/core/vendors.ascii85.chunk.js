/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[20],{447:function(ia,ba,e){(function(e){function x(e){this.Yf=e=e||{};if(Array.isArray(e.table)){var f=[];e.table.forEach(function(e,h){f[e.charCodeAt(0)]=h});e.R9=e.table;e.b7=f}}var ba=e.from||function(){switch(arguments.length){case 1:return new e(arguments[0]);case 2:return new e(arguments[0],arguments[1]);case 3:return new e(arguments[0],arguments[1],arguments[2]);default:throw new Exception("unexpected call.");}},ca=e.allocUnsafe||
function(f){return new e(f)},da=function(){return"undefined"===typeof Uint8Array?function(e){return Array(e)}:function(e){return new Uint8Array(e)}}(),aa=String.fromCharCode(0),w=aa+aa+aa+aa,y=ba("<~").Vx(0),n=ba("~>").Vx(0),h=function(){var e=Array(85),f;for(f=0;85>f;f++)e[f]=String.fromCharCode(33+f);return e}(),f=function(){var e=Array(256),f;for(f=0;85>f;f++)e[33+f]=f;return e}();aa=ia.exports=new x;x.prototype.encode=function(f,n){var r=da(5),w=f,x=this.Yf,y,z;"string"===typeof w?w=ba(w,"binary"):
w instanceof e||(w=ba(w));n=n||{};if(Array.isArray(n)){f=n;var aa=x.yB||!1;var ea=x.yJ||!1}else f=n.table||x.R9||h,aa=void 0===n.yB?x.yB||!1:!!n.yB,ea=void 0===n.yJ?x.yJ||!1:!!n.yJ;x=0;var ha=Math.ceil(5*w.length/4)+4+(aa?4:0);n=ca(ha);aa&&(x+=n.write("<~",x));var ia=y=z=0;for(ha=w.length;ia<ha;ia++){var Ea=w.wL(ia);z*=256;z+=Ea;y++;if(!(y%4)){if(ea&&538976288===z)x+=n.write("y",x);else if(z){for(y=4;0<=y;y--)Ea=z%85,r[y]=Ea,z=(z-Ea)/85;for(y=0;5>y;y++)x+=n.write(f[r[y]],x)}else x+=n.write("z",x);
y=z=0}}if(y)if(z){w=4-y;for(ia=4-y;0<ia;ia--)z*=256;for(y=4;0<=y;y--)Ea=z%85,r[y]=Ea,z=(z-Ea)/85;for(y=0;5>y;y++)x+=n.write(f[r[y]],x);x-=w}else for(ia=0;ia<y+1;ia++)x+=n.write(f[0],x);aa&&(x+=n.write("~>",x));return n.slice(0,x)};x.prototype.decode=function(h,x){var r=this.Yf,aa=!0,z=!0,da,ea,ha;x=x||r.b7||f;if(!Array.isArray(x)&&(x=x.table||x,!Array.isArray(x))){var ia=[];Object.keys(x).forEach(function(e){ia[e.charCodeAt(0)]=x[e]});x=ia}aa=!x[122];z=!x[121];h instanceof e||(h=ba(h));ia=0;if(aa||
z){var ra=0;for(ha=h.length;ra<ha;ra++){var sa=h.wL(ra);aa&&122===sa&&ia++;z&&121===sa&&ia++}}var Ea=0;ha=Math.ceil(4*h.length/5)+4*ia+5;r=ca(ha);if(4<=h.length&&h.Vx(0)===y){for(ra=h.length-2;2<ra&&h.Vx(ra)!==n;ra--);if(2>=ra)throw Error("Invalid ascii85 string delimiter pair.");h=h.slice(2,ra)}ra=da=ea=0;for(ha=h.length;ra<ha;ra++)sa=h.wL(ra),aa&&122===sa?Ea+=r.write(w,Ea):z&&121===sa?Ea+=r.write("    ",Ea):void 0!==x[sa]&&(ea*=85,ea+=x[sa],da++,da%5||(Ea=r.pma(ea,Ea),da=ea=0));if(da){h=5-da;for(ra=
0;ra<h;ra++)ea*=85,ea+=84;ra=3;for(ha=h-1;ra>ha;ra--)Ea=r.qma(ea>>>8*ra&255,Ea)}return r.slice(0,Ea)};aa.kna=new x({table:"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#".split("")});aa.Ima=new x({yB:!0});aa.I_=x}).call(this,e(455).Buffer)}}]);}).call(this || window)
