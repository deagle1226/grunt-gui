{% extends 'layout.swig' %}

{% block id %}logs{% endblock %}

{% block toolbar %}
	{% parent %}
	<span flex>Console Logs</span>
    <paper-icon-button tool icon="clear"></paper-icon-button>
    <paper-icon-button tool icon="refresh"></paper-icon-button>
    <paper-icon-button tool icon="settings"></paper-icon-button>
{% endblock %}

{% block content %}
	<section>
	    <ul></ul>
	</section>
{% endblock %}