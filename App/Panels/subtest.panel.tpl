[sub]
    {$test}
    {foreach from="$thing" item="item" key="key"}
        <li>{$key}:{$item}</li>
    {/foreach}
    {foreach from="$foo" item="item" key="key"}
        <li>{$key}</li>
    {/foreach}
    {if $something == 'wicked'}BLARGH!{else}ooooo{/if}
[/sub]