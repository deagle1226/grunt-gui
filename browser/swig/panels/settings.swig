{% extends 'layout.swig' %}

{% block id %}settings{% endblock %}

{% block toolbar %}
	{% parent %}
	<paper-icon-button tool icon="arrow-back"></paper-icon-button>
	<span flex>Settings</span>
	<paper-icon-button tool icon="refresh"></paper-icon-button>
{% endblock %}

{% block content %}
	<paper-input floatinglabel label="Path to Gruntfile.js" id="gruntfile"></paper-input>
{% endblock %}