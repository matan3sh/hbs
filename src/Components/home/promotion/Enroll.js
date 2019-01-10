import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import FormField from '../../ui/formFields';
import { validate } from '../../ui/misc';

import { firebasePromotions } from '../../../firebase';

class Enroll extends Component {

    state = {
        formError: false,
        formSuccess:'',
        formdata:{
            email:{
                element:'input',
                value:'',
                config:{
                    name:'email_input',
                    type:'email',
                    placeholder: 'Enter your email'
                },
                validation:{
                    required: true,
                    email: true
                },
                valid: false,
                validationMessage:''
            }
        }
    }

    updateForm(element){
        const newFormdata = {...this.state.formdata} 
        const newElement = {...newFormdata[element.id]}

        newElement.value = element.event.target.value;

        let validData = validate(newElement)
        newElement.valid = validData[0];
        newElement.validationMessage = validData[1];

        newFormdata[element.id] = newElement;

        this.setState({
            formError: false,
            formdata: newFormdata
        })

    }

    resetFormSuccess(type){
        const newFormdata = {...this.state.formdata} 

        for(let key in newFormdata){
            newFormdata[key].value='';
            newFormdata[key].valid=false;
            newFormdata[key].validationMessage='';
        }

        this.setState({
            formError:false,
            formdata: newFormdata,
            formSuccess: type ? 'Congratulations' : 'This email is already in the database'
        })
        this.successMessage();
    }

    /*clear success */
    successMessage(){
        setTimeout(()=>{
            this.setState({
                formSuccess:''
            })
        },2000)
    }

    submitForm(event){
        event.preventDefault();

        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formdata){
            dataToSubmit[key]=this.state.formdata[key].value;
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }

        if(formIsValid){
            //search email in database
            firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once("value")
            .then((snapshot)=>{
                //if the email not in the database
                if(snapshot.val() === null){
                    firebasePromotions.push(dataToSubmit);
                    this.resetFormSuccess(true)
                }else{
                    this.resetFormSuccess(false);
                }
            })

        } else {
            this.setState({
                formError: true
            })
        }
    }

    render() {
        return (
            <Fade>
                <div className="enroll_wrapper">
                    <form onSubmit={ (event)=> this.submitForm(event)}>
                        <div className="enroll_title">
                            Enter Your Email
                        </div>
                        <div className="enroll_input">
                            <FormField
                                id={'email'}
                                formdata={this.state.formdata.email}
                                change={(element)=> this.updateForm(element)}
                            />
                            {this.state.formError ? 
                                <div className="error_label">Something is wrong, try again.</div>
                                :null
                            }
                            <div className="success_label">{this.state.formSuccess}</div>
                            <button onClick={(event)=> this.submitForm(event)}>Enroll</button>
                            <div className="enroll_discl">
                            Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content.
                            </div>
                        </div>
                    </form>
                </div>
            </Fade>
        );
    }
}

export default Enroll;