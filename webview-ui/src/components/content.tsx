import "./content.css";
import React from "react";

export interface IContent {
	children: any
}

export default function TdsContent(props: IContent) {
	let children = React.Children.toArray(props.children);

	return (
		<div className="tds-content">
			{...children}
		</div>
	);
}
