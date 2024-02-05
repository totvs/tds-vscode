import "./page.css";
import TdsHeader from "./header";
import TdsFooter from "./footer";
import TdsContent from "./content";

export interface IPageView {
	title: string;
	linkToDoc: string
	children: any
}

export default function TdsPage(props: IPageView) {

	return (
		<section className="tds-page">
			<TdsHeader title={props.title} linkToDoc={props.linkToDoc} />
			<TdsContent>
				{props.children}
			</TdsContent>
			<TdsFooter linkToDoc={"link"} />
		</section>
	);
}
