import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetDesigns } from "../../redux/designs";



function TestingPage() {
    const dispatch = useDispatch();
    const allDesigns = useSelector(state => state.design);


    useEffect(() => {
        dispatch(thunkGetDesigns());
    }, [dispatch]);

    const DesignList = () => {
        if (allDesigns) {
            return (
                allDesigns.map((design) => (
                    <li key={design.id}>
                        <p>  {design.title}</p>


                    </li>
                ))
            )

        }
    };


    return (
        <div>
            <DesignList />




        </div>
    )




}
export default TestingPage;