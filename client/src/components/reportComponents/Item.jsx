import React from 'react'
import {FaCartShopping} from 'react-icons/fa6'

const Item = ({name, value, icon}) => {
    return (
        <div className="col-lg-3">
            <div className="card card-eco">
                <div className="card-body">
                    <div className="row">
                        <div className="col-8">
                            <h4 className="title-text mt-0">{name}</h4>
                            <h3 className="font-weight-semibold mb-1">{value}</h3>
                        </div>
                        <div className="col-4 text-center align-self-center">
                            {icon}
                        </div>
                    </div>
                    <div className="bg-pattern"></div>
                </div>
            </div>
        </div>
    )
}

export default Item