{require name="JavascriptParser"}<!--js_lint,mootools,budget_rules,core,table-->
{require name="BudgetRules" directory="local"}
<h1 onclick="document.id('rules').toggle();" style="cursor:pointer">Rules</h1>
<a href="#" onclick="document.id('rules').removeClass('boxes').addClass('code')">text</a> | <a href="#" onclick="document.id('rules').removeClass('code').addClass('boxes')">boxes</a>
<div id="rules" class="code" style="text-align:left;">
    <div id="gui"></div>
    <div id="well" class="rules container" style="min-width:600px;min-height:40px;"></div>
</div>
<input type="button" onclick="ruleInput.new();" value="+"\>
<input type="button" onclick="ruleInput.push(); document.id('warnings').empty();" value="save"\>
