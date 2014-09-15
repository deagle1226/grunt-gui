<core-header-panel main flex mode="waterfall" id="{% block id %}{% endblock %}">
    <core-toolbar>
    	{% block toolbar %}
    		<paper-icon-button tool icon="menu"></paper-icon-button>
    	{% endblock %}
    </core-toolbar>
    <div>
		{% block content %}{% endblock %}    
    </div>
</core-header-panel>