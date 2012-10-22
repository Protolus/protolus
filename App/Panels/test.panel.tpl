<html>
    <body>
        {$test}
        {foreach from="$thing" item="item" key="key"}
            <li>{$key}:{$item}</li>
        {/foreach}
    </body>
</html>