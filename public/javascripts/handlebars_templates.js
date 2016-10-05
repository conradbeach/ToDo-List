this["JST"] = this["JST"] || {};

this["JST"]["todo"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return ": "
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"description","hash":{},"data":data}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
    return "<time>"
    + container.escapeExpression((helpers.formatDate || (depth0 && depth0.formatDate) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.dueDate : depth0),{"name":"formatDate","hash":{},"data":data}))
    + "</time>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\""
    + alias3((helpers.ternary || (depth0 && depth0.ternary) || alias2).call(alias1,(depth0 != null ? depth0.completed : depth0),"complete","",{"name":"ternary","hash":{},"data":data}))
    + "\"><span><strong>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</strong>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dueDate : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span><a href=\"#\"></a></li>";
},"useData":true});