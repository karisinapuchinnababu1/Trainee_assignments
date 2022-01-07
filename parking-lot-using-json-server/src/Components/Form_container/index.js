import "./index.css";
import { useState } from "react";
import { v4 } from "uuid";
import { useEffect, useRef } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "../../api/data";
import { submit } from "../Reducer/action";
import { connect, useSelector } from "react-redux";

const FormContainer = ({ onSubmit }) => {
	const editbelData = useSelector((state) => state.editbleData);
	const isEdit = useSelector((state) => state.isEdit);
	console.log(isEdit);

	const data = useRef("");
	const [userFileds, setuserFileds] = useState({
		ownerName: "",
		registraionNumber: "",
		color: "",
		slotNumber: "",
		carOrBike: "",
	});

	const [requiredFileds, setrequiredFileds] = useState({
		ownerField: "",
		registrationField: "",
		colorField: "",
		slotNumberField: "",
	});

	const ownerNameInput = (e) => {
		setuserFileds((prevState) => ({
			...prevState,
			ownerName: e.target.value,
		}));
		setrequiredFileds((prevState) => ({
			...prevState,
			ownerField: "",
		}));
	};
	const registraionNumberInput = (e) => {
		setuserFileds((prevState) => ({
			...prevState,
			registraionNumber: e.target.value,
		}));
		setrequiredFileds((prevState) => ({
			...prevState,
			registrationField: "",
		}));
	};
	const colorInput = (e) => {
		setuserFileds((prevState) => ({
			...prevState,
			color: e.target.value,
		}));
		setrequiredFileds((prevState) => ({
			...prevState,
			colorField: "",
		}));
	};
	const slotInput = (e) => {
		setuserFileds((prevState) => ({
			...prevState,
			slotNumber: e.target.value,
		}));
		setrequiredFileds((prevState) => ({
			...prevState,
			slotNumberField: "",
		}));
	};

	const onChangeCar = (e) => {
		setuserFileds((prevState) => ({
			...prevState,
			carOrBike: e.target.value,
		}));
	};

	const onChangeBike = (e) => {
		setuserFileds((prevState) => ({
			...prevState,
			carOrBike: e.target.value,
		}));
	};

	const onsubmit = (e) => {
		e.preventDefault();
		onSubmit();
		let newData;
		isEdit
			? (newData = {
					id: editbelData.id,
					ownerName: userFileds.ownerName,
					registraionNumber: userFileds.registraionNumber.toUpperCase(),
					color: userFileds.color,
					slotNum: userFileds.slotNumber,
					carOrBike: userFileds.carOrBike,
			  })
			: (newData = {
					id: v4(),
					ownerName: userFileds.ownerName,
					registraionNumber: userFileds.registraionNumber.toUpperCase(),
					color: userFileds.color,
					slotNum: userFileds.slotNumber,
					carOrBike: userFileds.carOrBike,
			  });

		if (userFileds.ownerName === "") {
			setrequiredFileds((prevState) => ({
				...prevState,
				ownerField: "Required",
			}));
		}
		if (userFileds.registraionNumber === "") {
			setrequiredFileds((prevState) => ({
				...prevState,
				registrationField: "Required",
			}));
		}
		if (userFileds.color === "") {
			setrequiredFileds((prevState) => ({
				...prevState,
				colorField: "Required",
			}));
		}
		if (userFileds.slotNumber === "") {
			setrequiredFileds((prevState) => ({
				...prevState,
				slotNumberField: "Required",
			}));
		} else if (userFileds.ownerName.match(/^[A-Za-z ]+$/) === null) {
			setrequiredFileds((prevState) => ({
				...prevState,
				ownerField: "field formate is wrong",
			}));
		} else if (
			userFileds.registraionNumber.match(
				/^[A-Za-z]{2}[0-9]{2}(-)[A-Za-z]{2}(-)[0-9]{4}$/
			) === null
		) {
			setrequiredFileds((prevState) => ({
				...prevState,
				registrationField: "Registaration number formate is wrong",
			}));
		} else if (userFileds.color.match(/^[A-Za-z]+$/) === null) {
			setrequiredFileds((prevState) => ({
				...prevState,
				colorField: "field formate is wrong",
			}));
		} else if (userFileds.slotNumber.match(/^[0-9]+$/) === null) {
			setrequiredFileds((prevState) => ({
				...prevState,
				slotNumberField: "Please enter number",
			}));
		} else if (
			userFileds.ownerName !== "" &&
			userFileds.registraionNumber !== "" &&
			userFileds.color !== "" &&
			userFileds.slotNumber !== ""
		) {
			isEdit
				? axios.put(`/data/${newData.id}`, newData).then((response) => {
						console.log(response.data);
				  })
				: axios.post("/data", newData).then((response) => {
						console.log(response);
				  });

			setuserFileds((prevState) => ({
				...prevState,
				ownerName: "",
				registraionNumber: "",
				color: "",
				slotNumber: "",
				carOrBike: "",
			}));
		}
	};

	useEffect(() => {
		if (editbelData.length !== 0) {
			setuserFileds({
				ownerName: editbelData.ownerName,
				registraionNumber: editbelData.registraionNumber,
				color: editbelData.color,
				slotNumber: editbelData.slotNum,
				carOrBike: editbelData.carOrBike,
			});
		}
		setrequiredFileds({
			ownerField: "",
			registrationField: "",
			colorField: "",
			slotNumberField: "",
		});
	}, [editbelData]);

	useEffect(() => {
		data.current.focus();
	}, []);
	return (
		<form className="form" onSubmit={onsubmit} action="/action_page.php">
			<div className="input_info">
				<input
					type="text"
					className="input_tag"
					placeholder="Owner_Name"
					value={userFileds.ownerName}
					onChange={ownerNameInput}
					ref={data}
				/>
				<AiOutlineInfoCircle className="info" />
				<p className="instractions">Enter owner name</p>
			</div>

			<p className="required">{requiredFileds.ownerField}</p>
			<div className="input_info">
				<input
					type="text"
					className="input_tag"
					placeholder="Registration_Number"
					value={userFileds.registraionNumber}
					onChange={registraionNumberInput}
				/>
				<AiOutlineInfoCircle className="info" />
				<p className="instractions">
					Registraion number formate is should be like this "AP09-FF-1234"
				</p>
			</div>
			<p className="required">{requiredFileds.registrationField}</p>
			<div className="input_info">
				<input
					type="text"
					className="input_tag"
					placeholder="Car/Bike_Colour"
					value={userFileds.color}
					onChange={colorInput}
				/>
				<AiOutlineInfoCircle className="info" />
				<p className="instractions">Enter car/bike Colour</p>
			</div>
			<p className="required">{requiredFileds.colorField}</p>
			<div className="input_info">
				<input
					type="text"
					className="input_tag"
					placeholder="Slot_Number"
					value={userFileds.slotNumber}
					onChange={slotInput}
				/>
				<AiOutlineInfoCircle className="info" />
				<p className="instractions">Enter Slot number</p>
			</div>
			<p className="required">{requiredFileds.slotNumberField}</p>
			<div className="radio">
				<input
					type="radio"
					id="car"
					value="car"
					name="vehical"
					onChange={onChangeCar}
					checked={
						isEdit ? (userFileds.carOrBike === "car" ? true : false) : null
					}
				/>
				<label htmlFor="car">Car</label>
				<input
					type="radio"
					id="bike"
					value="bike"
					name="vehical"
					onChange={onChangeBike}
					checked={
						isEdit ? (userFileds.carOrBike === "bike" ? true : false) : null
					}
				/>
				<label htmlFor="bike">Bike</label>
			</div>
			<button type="submit" className="sub_btn">
				Submit
			</button>
		</form>
	);
};

const mapDispatchToProps = (dispatch) => ({
	onSubmit: () => dispatch(submit()),
});

export default connect(null, mapDispatchToProps)(FormContainer);
