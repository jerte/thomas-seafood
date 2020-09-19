// site header

const headerStyle = {
	border: "solid black 3px"	
};

const Header = props => (
	<div className="font-acme" style={headerStyle}>
		<div className="row">
			<div className="col-12"><h1>THOMAS TACKLE & SEAFOOD</h1></div>
		</div>
		<div className="row">
			<div className="col-12">{props.children.split(',')}</div>
		</div>
	</div>
);


export default Header;
/**
<br>
<div class="font-acme alignCenter container-fluid">

    <div class="row">
        <table class="width100"><tr><td><img class="logo-img" src="/images/logo1.png"></td>
        <td><h1 class="header">THOMAS TACKLE & SEAFOOD</h1></td>
        <td><img class="logo-img" src="/images/logo2.png"></td>
        </tr></table>
    </div>
</div>
<nav class="margin0 container-fluid b">
    <div class="row">
      <% for(var i of data['nav']) { %>
        <% if(i['json']) { %>
          <div class="col-3 b">
          <a href="
            <% if(locals.access) { %>/admin<% } %>
            <%= i['json']['link'] %>" class="font-acme padding0 nav-link nav-link-custom ">
          <h4><%= i['name'] %></h4>
          </a></div>
        <% } %>
      <% } %>
    </div>
    </div>
</nav>

<div id="header-bottom"></div>
**/
