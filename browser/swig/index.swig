<!DOCTYPE html>
<html>
    <head>
        <title>grunt-gui</title>
        <link href="../css/main.css" rel="stylesheet" type="text/css" />
        <script src="../bower/platform/platform.js"></script>
        <link rel="import" href="../bower/core-elements/core-elements.html">
        <link rel="import" href="../bower/core-animation/core-animation.html">
        <link rel="import" href="../bower/paper-elements/paper-elements.html">
    </head>
    <body unresolved>
        <core-drawer-panel>
            <core-header-panel drawer flex mode="waterfall">
                <core-toolbar>
                    <span flex>Grunt Tasks</span>
                    <paper-toggle-button verbose></paper-toggle-button>
                </core-toolbar>
                <core-menu>
                {% include "./task-menu.swig" %}
                </core-menu>
                <paper-fab icon="restore" get-tasks></paper-fab>
                <paper-shadow z="1"></paper-shadow>
            </core-header-panel>
            {% include "./panels/logs.swig" %}
            {% include "./panels/settings.swig" %}
        </core-drawer-panel>
    </body>
    <script>
        require('../js/app.js').init();
    </script>
</html>