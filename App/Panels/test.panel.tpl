{page wrapper="justa"}
{$test}
{foreach from="$thing" item="item" key="key"}
    <li>{$key}:{$item}</li>
{/foreach}
{panel name="subtest"}
{if $something == '5'}BLARGH!{else}ooooo{/if}