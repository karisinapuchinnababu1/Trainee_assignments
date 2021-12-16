import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ListContext from "../Context/ListContext";
import "./index.css";

function ListView() {
	const context = useContext(ListContext);
	let data;
	if (context.list.length === 0) {
		data = false;
	} else {
		data = true;
	}
	const [search, setsearch] = useState("");
	const addSerach = event => {
		console.log(event.target.value);
		setsearch(event.target.value);
	};

	const searchList = context.list.filter(each => each.name.includes(search));

	return (
		<div className="bg-container1">
			<div className="from-container1">
				<input type="text" onChange={addSerach} />
				<ul className="list">
					<li className="list-item">
						<h1 className="heading">NAME</h1>
						<h1 className="heading">Email</h1>
						<h1 className="heading">Date</h1>
					</li>

					{data ? (
						searchList.map(each => (
							<li className="list-item1" key={each.id}>
								<h1 className="heading">{each.name}</h1>
								<h1 className="heading">{each.email}</h1>
								<h1 className="heading">{each.date}</h1>
							</li>
						))
					) : (
						<li className="no-data">
							<h1 className="heading">No data Found</h1>
						</li>
					)}
				</ul>
				<button className="btn2">
					<Link to="/Create" className="link">
						Create
					</Link>
				</button>
			</div>
		</div>
	);
}

export default ListView;
