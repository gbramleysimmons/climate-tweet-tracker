(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{115:function(t,e,a){},116:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),s=a(29),i=a.n(s),o=(a(55),a(4)),l=a(5),c=a(7),u=a(6),m=a(8),p=(a(56),a(20)),d=a(45),h=(a(57),a(58),function(t){function e(t){var a;Object(o.a)(this,e),(a=Object(c.a)(this,Object(u.a)(e).call(this,t))).generate_color=function(){return 0===a.props.number?{main:"#808080",selected:"#2E76AE"}:1===a.props.number?{main:"#808080",selected:"#FA802D"}:2===a.props.number?{main:"#808080",selected:"#3C9E2C"}:3===a.props.number?{main:"#808080",selected:"#D52B1E"}:{main:"#808080",selected:"black"}},a.on_click=function(){a.state.selected?(a.setState({selected:!1,curr_color:a.state.color.main}),a.props.toggleSelect(a.props.hashtag,!1)):(a.setState({selected:!0,curr_color:a.state.color.selected}),a.props.toggleSelect(a.props.hashtag,!0))};var n=a.generate_color();return a.state={selected:!1,color:n,curr_color:n.main},a}return Object(m.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){var t=this.state.selected?"selected":"unselected";return t="Hashtag "+t,r.a.createElement("div",{className:t,onClick:this.on_click,style:{background:this.state.curr_color}},"#",this.props.hashtag)}}]),e}(n.Component)),g=function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(c.a)(this,Object(u.a)(e).call(this,t))).toggleSelect=function(t,e){var n=a.state.selectedHashtags;n[t]=e,a.setState({selectedHashtags:n},a.props.callbackFromParent(n))},a.state={selectedHashtags:a.props.hashtags.reduce(function(t,e){return Object(d.a)({},t,Object(p.a)({},e,!1))},{})},a}return Object(m.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"hashtags"},this.props.hashtags.map(function(e,a){return r.a.createElement(h,{hashtag:e,number:a,toggleSelect:t.toggleSelect})}))}}]),e}(n.Component),f=a(14),v=(a(59),a(2)),y=(a(60),function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(c.a)(this,Object(u.a)(e).call(this,t))).createDynamicChart=a.createDynamicChart.bind(Object(f.a)(Object(f.a)(a))),a.referMe=r.a.createRef(),a}return Object(m.a)(e,t),Object(l.a)(e,[{key:"componentDidMount",value:function(){this.createDynamicChart()}},{key:"componentDidUpdate",value:function(){this.createDynamicChart()}},{key:"createDynamicChart",value:function(){console.log("this.props.hashtags: "+this.props.hashtags),console.log("hashtag[#cats] :"+this.props.hashtags.cats),v.o("g").remove();var t=this.props.freq;if(0!=t.length){var e=this.node,a=1*document.getElementsByClassName("wrapper-left")[0].offsetWidth,n=.73*a,r=a/63,s=a/27;document.getElementById("svg").style.height=1*n,document.getElementById("svg").style.width=1*a;var i="0 0 "+1.125*a+" "+1.04*n,o=v.n(e).attr("preserveAspectRatio","xMinYMin meet").attr("viewBox",i).append("g").attr("transform","translate("+s+","+r+")"),l=!1;for(var c in this.props.hashtags)this.props.hashtags[c]&&(l=!0);if(l){var u=v.p("%Y%m%d%H%M"),m=v.l().range([0,a]),p=v.j().range([n,0]),d=v.k(v.m),h=v.a(m).tickSize(n/120),g=v.b(p).tickSize(n/120),f=v.f().x(function(t){return m(t.date)}).y(function(t){return p(t.temperature)}),y=v.q(t);d.domain(v.e(y[0]).filter(function(t){return"date"!==t})),y.forEach(function(t){t.date=u(t.date)});var b=this.props.hashtags,k=d.domain().map(function(t){return console.log("name in line 263 :"+t),b[t.slice(1)]?{name:t,values:y.map(function(e){return{date:e.date,temperature:+e[t]}})}:{name:"",values:y.map(function(t){return{date:"",temperature:null}})}});m.domain(v.d(y,function(t){return t.date})),p.domain([v.h(k,function(t){return v.h(t.values,function(t){return t.temperature})}),v.g(k,function(t){return v.g(t.values,function(t){return t.temperature})})]);var E=o.selectAll("g").data(k).enter().append("g").attr("class","legend");E.append("rect").attr("x",.98*a).attr("y",function(t,e){return(e+1)*n/20}).attr("width",n/68).attr("height",n/68).style("fill",function(t){return""==t.name?"gray":d(t.name)}),E.append("text").attr("x",1*a).attr("y",function(t,e){return(e+1.3)*n/20}).attr("font-size",n/40+"px").text(function(t){return t.name}),o.append("g").attr("class","x axis").call(h).attr("font-size",n/50+"px").style("stroke-width",n/430),o.append("g").attr("class","y axis").call(g).attr("font-size",n/50+"px").style("stroke-width",n/430).append("text").attr("font-size",n/50+"px").attr("transform","translate("+n/30+", 0)").attr("y",n/100).attr("x",-n/30).attr("dy",".71em").style("text-anchor","end").text("number of tweets").style("fill","#0F3A6F").attr("transform","rotate(-90)");var w=o.selectAll(".city").data(k).enter().append("g").attr("class","city");w.append("path").attr("class","line").style("stroke-width",n/250).attr("d",function(t){return f(t.values)}).style("stroke",function(t){return d(t.name)}),w.append("text").datum(function(t){return{name:t.name,value:t.values[t.values.length-1]}}).attr("transform",function(t){return"translate("+m(t.value.date)+","+p(t.value.temperature)+")"}).attr("x",3).attr("dy",".35em").attr("font-size",n/40+"px").text(function(t){return t.name});var x=o.append("g").attr("class","mouse-over-effects");x.append("path").attr("class","mouse-line").style("stroke","black").style("stroke-width","1px").style("opacity","0");var N=this.props.lines,O=x.selectAll(".mouse-per-line").data(k).enter().append("g").attr("class","mouse-per-line");O.append("circle").attr("r",n/65).style("stroke",function(t){return d(t.name)}).style("fill","none").style("stroke-width",n/350+"px").style("opacity","0"),O.append("text").attr("transform","translate(10,3)"),x.append("svg:rect").attr("width",a).attr("height",n).attr("fill","none").attr("pointer-events","all").on("mouseout",function(){v.n(".mouse-line").style("opacity","0"),v.o(".mouse-per-line circle").style("opacity","0"),v.o(".mouse-per-line text").style("opacity","0")}).on("mouseover",function(){v.n(".mouse-line").style("opacity","1"),v.o(".mouse-per-line circle").style("opacity","1"),v.o(".mouse-per-line text").style("opacity","1").attr("font-size",n/35+"px")}).on("mousemove",function(){var t=v.i(this);v.n(".mouse-line").attr("d",function(){var e="M"+t[0]+","+n;return e+=" "+t[0]+",0"}),v.o(".mouse-per-line").attr("transform",function(e,a){for(var n,r=m.invert(t[0]),s=((0,v.c(function(t){return t.date}).right)(e.values,r),0),i=N[a].getTotalLength(),o=null;o=Math.floor((s+i)/2),n=N[a].getPointAtLength(o),o!==i&&o!==s||n.x===t[0];)if(n.x>t[0])i=o;else{if(!(n.x<t[0]))break;s=o}return v.n(this).select("text").text(p.invert(n.y).toFixed(2)),"translate("+t[0]+","+n.y+")"})})}else o.append("text").text("Please select hashtags below to track their frequency.").attr("y",n/2).attr("x",n/3).attr("font-size",n/30+"px")}}},{key:"render",value:function(){var t=this;return console.log("lines:"+this.props.lines),console.log("width:"+this.props.width),r.a.createElement("div",{className:"Graph"},r.a.createElement("div",{id:"svg"},r.a.createElement("svg",{ref:function(e){return t.node=e}})))}}]),e}(n.Component)),b=(a(61),a(62),function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(c.a)(this,Object(u.a)(e).call(this,t))).state={image:null},a}return Object(m.a)(e,t),Object(l.a)(e,[{key:"componentDidMount",value:function(){this.props.image?this.setState({image:this.props.image}):this.setState({image:"https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"})}},{key:"render",value:function(){return r.a.createElement("div",{className:"tweet"},r.a.createElement("img",{className:"tweet-image",src:this.state.image,alt:"Tweet Author"}),r.a.createElement("div",{className:"tweet-author"},this.props.author),r.a.createElement("div",{className:"tweet-text"},this.props.text))}}]),e}(n.Component)),k=function(t){function e(){return Object(o.a)(this,e),Object(c.a)(this,Object(u.a)(e).apply(this,arguments))}return Object(m.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"tweet-feed"},r.a.createElement("div",{className:"header"},"Real-Time Statuses"),r.a.createElement("div",{className:"tweets"},this.props.tweets.map(function(t){return r.a.createElement(b,{image:t.image,author:t.author,text:t.text})})))}}]),e}(n.Component),E=a(46),w=a.n(E),x=(a(91),a(47)),N=a.n(x),O=function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(c.a)(this,Object(u.a)(e).call(this,t))).login=function(t){console.log("here"),t.preventDefault();var e=t.target[0].value,n=N.a.SHA256(t.target[1].value).toString();A.emit("authorize",e,n,function(t){var n=JSON.parse(t);console.log(n),n.hasOwnProperty("error")?a.setState({error:n.error}):(a.setState({authorized:n.validated}),n.validated&&a.props.authorize(e))})},a.state={error:"",authorized:!1},a}return Object(m.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"Login"},r.a.createElement("h1",null,"Login"),r.a.createElement("form",{className:"login-form",onSubmit:this.login},r.a.createElement("input",{type:"text",className:"login-input",placeholder:"Username",autoComplete:"off"}),r.a.createElement("input",{type:"password",className:"login-input",placeholder:"Password"}),r.a.createElement("input",{type:"submit",value:"Login"})),r.a.createElement("div",{className:"error"},this.state.error))}}]),e}(n.Component),S=(a(115),function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(c.a)(this,Object(u.a)(e).call(this,t))).removeFromTracking=function(t){var e=a.state.trackHashtags.filter(function(e){return e!==t});a.setState({trackHashtags:e})},a.removeFromDisplay=function(t){var e=a.state.displayHashtags.filter(function(e){return e!==t});a.setState({displayHashtags:e})},a.addToTracking=function(t){var e=a.state.trackHashtags;e.push(t),a.setState({trackHashtags:e})},a.addToDisplay=function(t){var e=a.state.displayHashtags;e.push(t),a.setState({displayHashtags:e})},a.toggleTracking=function(){a.setState({editingTracking:!a.state.editingTracking})},a.toggleDisplay=function(){a.setState({editingDisplay:!a.state.editingDisplay})},a.addSubmitTracking=function(t){t.preventDefault(),a.addToTracking(t.target[0].value),t.target.reset()},a.addSubmitDisplay=function(t){t.preventDefault(),console.log(a.state.trackHashtags),console.log(t.target[0].value in a.state.trackHashtags),a.state.trackHashtags.includes(t.target[0].value)?(a.setState({displayError:""}),a.addToDisplay(t.target[0].value),t.target.reset()):a.setState({displayError:"Error: hashtag not currently being tracked"})},a.confirmDisplay=function(){a.toggleDisplay(),console.log("confirm!!"+a.state.displayHashtags),A.emit("setDisplayed",a.state.displayHashtags)},a.confirmTracking=function(){a.toggleTracking(),A.emit("setTracked",a.state.trackHashtags)},a.state={displayHashtags:a.props.displaying,trackHashtags:a.props.tracking,editingTracking:!1,editingDisplay:!1,displayError:""},a}return Object(m.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){var t=this;return console.log(this.props),r.a.createElement("div",{className:"Console"},r.a.createElement("h1",null,"Admin Console"),r.a.createElement("div",{className:"back-button",onClick:this.props.close},"Back to dashboard"),r.a.createElement("div",{className:"current track"},r.a.createElement("h3",null," Current Hashtags Being Tracked: "),this.state.editingTracking?r.a.createElement("div",null,this.state.trackHashtags.map(function(e){return r.a.createElement("div",{className:"hashtag-curr"},r.a.createElement("button",{onClick:function(){return t.removeFromTracking(e)},className:"remove-button"},"X"),"  #",e)}),r.a.createElement("form",{className:"submit-form",onSubmit:this.addSubmitTracking},r.a.createElement("input",{id:"tracking-input",type:"text",placeholder:"Add hashtags to track"}),r.a.createElement("input",{type:"submit",value:"Add"})),r.a.createElement("button",{className:"admin-button",onClick:this.confirmTracking},"Confirm")):r.a.createElement("div",null,this.state.trackHashtags.map(function(t){return r.a.createElement("div",{className:"hashtag-curr"},"#",t)}),r.a.createElement("button",{className:"admin-button",onClick:this.toggleTracking,id:"edit-button"},"Edit"))),r.a.createElement("div",{className:"current display"},r.a.createElement("h3",null,"  Current Hashtags Being Displayed: "),this.state.editingDisplay?r.a.createElement("div",null,this.state.displayHashtags.map(function(e){return r.a.createElement("div",{className:"hashtag-curr"}," ",r.a.createElement("button",{onClick:function(){return t.removeFromDisplay(e)},className:"remove-button"},"X")," #",e)}),r.a.createElement("form",{onSubmit:this.addSubmitDisplay,className:"submit-form"},r.a.createElement("input",{id:"display-input",type:"text",placeholder:"Add hashtags to track"}),r.a.createElement("input",{type:"submit",value:"Add"})),r.a.createElement("div",{className:"display-error"}," ",this.state.displayError," "),r.a.createElement("button",{className:"admin-button",onClick:this.confirmDisplay},"Confirm")):r.a.createElement("div",null,this.state.displayHashtags.map(function(t){return r.a.createElement("div",{className:"hashtag-curr"},"#",t)}),r.a.createElement("button",{className:"admin-button",onClick:this.toggleDisplay,id:"edit-button"},"Edit"))))}}]),e}(n.Component)),j=a(48),C=a.n(j),D=a(49),H=a.n(D),T=new URL(window.location.href);T.port=8e3,console.log(T.toString());var A=w.a.connect(T.toString()),z=function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(c.a)(this,Object(u.a)(e).call(this,t))).updateFeed=function(t){A.emit("updateFeed",t),A.on("tweetsForFeed",function(t){var e=a.formatTweets(t);a.setState({tweets:e})})},a.updateGraph=function(t){A.emit("displayData",t),A.on("tweetsForGraph",function(t){var e=a.formatData(t);a.setState({data:e})})},a.toggleLogin=function(){a.setState({login:!a.state.login})},a.authorize=function(t){a.setState({authorized:!0,user:t}),a.toggleLogin()},a.toggleConsole=function(){a.setState({console:!a.state.console})},a.myCallback=function(t){console.log("hashtags from App.js line 129: "+t),a.setState({hashtags:t})},a.formatData=function(t){var e=a.state.displaying,n=[],r=["date"];for(var s in e)r.push("#"+e[s]);n.push(r);var i=new Set,o=0;for(var l in t){var c=a.parseDateString(t[l].date);if(i.has(c)){var u=e.indexOf(t[l].hashtag);n[o][u+1]++}else{i.add(c);for(var m=[c],p=0;p<e.length;p++)m.push(0);n.push(m),o++;var d=e.indexOf(t[l].hashtag);n[o][d+1]++}}return console.log(n),a.dataToString(n)},a.parseDateString=function(t){var e=new Date(t),n="",r=e.getFullYear(),s=("0"+(e.getMonth()+1)).slice(-2),i=e.getDate(),o=("0"+e.getHours()).slice(-2),l=e.getMinutes();return n+=r+s+i+o+("0"+a.roundMinutes(l)).slice(-2)},a.roundMinutes=function(t){return 5*Math.floor(t/5)},a.dataToString=function(t){for(var e="",a=0;a<t.length;a++)e+=t[a].join("\t")+"\n";return e},a.formatTweets=function(t){var e=[];for(var a in t){var n={};n.image=t[a].picture,n.author=t[a].author,n.text=t[a].contents,e.push(n)}return e},a.offsetW=0,a.state={isLoading:!0,login:!1,authorized:!1,user:"",console:!1,tweets:[],data:"",tracking:[],displaying:[],hashtags:{}},a}return Object(m.a)(e,t),Object(l.a)(e,[{key:"componentDidMount",value:function(){var t=this;setTimeout(function(){return t.setState({isLoading:!1})},800),console.log("this.offsetW in App.js:"+this.offsetW),A.on("updateHashtags",function(e){var a=JSON.parse(e);t.setState({tracking:a.tracked,displaying:a.displayed}),t.updateFeed(a.displayed),t.updateGraph(a.displayed)})}},{key:"render",value:function(){return!this.state.data||this.state.isLoading?r.a.createElement(C.a,{className:"loading-icon",type:"spinningBubbles",color:"white",height:"20%",width:"20%"}):r.a.createElement("div",{className:"App"},this.state.console?r.a.createElement(S,{close:this.toggleConsole,tracking:this.state.tracking,displaying:this.state.displaying}):r.a.createElement("div",{className:"App"}," ",this.state.login?r.a.createElement(O,{authorize:this.authorize,close:this.toggleLogin}):null,r.a.createElement("div",{className:"login-link"},this.state.authorized?r.a.createElement("span",{onClick:this.toggleConsole}," Welcome, ",this.state.user," "):r.a.createElement("span",{onClick:this.toggleLogin},"Admin")),r.a.createElement("div",{className:"wrapper-left"},r.a.createElement("div",{className:"title-block"},r.a.createElement("div",{className:"title-text"},"Climate #Hashtag Tracker")),r.a.createElement(y,{freq:this.state.data,width:this.offsetW,height:500,lines:document.getElementsByClassName("line"),svg:document.getElementById("svg"),hashtags:this.state.hashtags}),r.a.createElement(g,{hashtags:this.state.displaying,callbackFromParent:this.myCallback})),r.a.createElement("div",{className:"wrapper-right"},r.a.createElement("div",{className:"branding-wrapper"},r.a.createElement("div",{className:"logo"},r.a.createElement("img",{className:"logo-img",src:H.a})),r.a.createElement("div",{className:"branding-block"},r.a.createElement("div",{className:"school"},"Brown University"),r.a.createElement("div",{className:"lab"},"Climate Development Lab"))),r.a.createElement(k,{tweets:this.state.tweets}))))}}]),e}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},49:function(t,e,a){t.exports=a.p+"static/media/cdllogo2.97d399a8.png"},50:function(t,e,a){t.exports=a(116)},55:function(t,e,a){},56:function(t,e,a){},57:function(t,e,a){},58:function(t,e,a){},59:function(t,e,a){},61:function(t,e,a){},62:function(t,e,a){},88:function(t,e){},91:function(t,e,a){}},[[50,1,2]]]);
//# sourceMappingURL=main.8cfa3b51.chunk.js.map