import React from 'react';

const Form = (props) => {
    return (
        <form onSubmit={props.submitHandler}>
            {props.children}
        </form>
    )
}

export default Form