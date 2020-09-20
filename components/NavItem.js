// nav item

import Link from "next/link";

const nav = props => (
	<li className="nav-item">
	<a className="nav-link" href={props.path}>
		<span>{props.name}</span>
	</a>
	</li>
);

export default nav;
