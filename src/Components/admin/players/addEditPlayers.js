import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout';

import FormField from '../../ui/formFields';
import { validate } from '../../ui/misc';

import Fileuploader from '../../ui/fileuploader';
import { firebasePlayers , firebaseDB, firebase } from '../../../firebase';


class AddEditPlayers extends Component {

    state = {
        playerId:'',
        formType: '',
        formError: false,
        formSuccess: '',
        defaultImg: '',
        formdata:{
                name:{
                    element:'input',
                    value:'',
                    config:{
                        label: 'Player Name',
                        name:'name_input',
                        type:'text'
                    },
                    validation:{
                        required: true,
                    },
                    valid: false,
                    validationMessage:'',
                    showlabel: true
                },
                lastname:{
                    element:'input',
                    value:'',
                    config:{
                        label: 'Player Last Name',
                        name:'lastname_input',
                        type:'text'
                    },
                    validation:{
                        required: true,
                    },
                    valid: false,
                    validationMessage:'',
                    showlabel: true
                },
                number:{
                    element:'input',
                    value:'',
                    config:{
                        label: 'Player Number',
                        name:'number_input',
                        type:'text'
                    },
                    validation:{
                        required: true,
                    },
                    valid: false,
                    validationMessage:'',
                    showlabel: true
                },
                position:{
                    element:'select',
                    value:'',
                    config:{
                        label: 'Select a Position',
                        name:'select_position',
                        type:'select',
                        options: [
                            {key:"Center",value:"Center"},
                            {key:"Power Forward",value:"Power Forward"},
                            {key:"Small Forward",value:"Small Forward"},
                            {key:"Second Guard",value:"Second Guard"},
                            {key:"Point Guard",value:"Point Guard"}
                        ]
                    },
                    validation:{
                        required: true,
                    },
                    valid: false,
                    validationMessage:'',
                    showlabel: true
                },
                image:{
                    element:'image',
                    value:'',
                    validation:{
                        required: true
                    },
                    valid:false
                }
        }
    }

    updateFields = (player, playerId, formType, defaultImg) => {
        const newFormdata = {...this.state.formdata}

        for(let key in newFormdata){
            newFormdata[key].value = player[key];
            newFormdata[key].valid = true
        }

        this.setState({
            playerId, 
            defaultImg,
            formType,
            formdata: newFormdata
        })
    }

    //checks if the player has an ID or not, if he has an ID so its a Edit Player action, else its Add Player
    componentDidMount(){
        const playerId = this.props.match.params.id;

        if(!playerId){
            this.setState({
                formType: 'Add Player'
            })
        } else {
            firebaseDB.ref(`players/${playerId}`).once('value')
            .then(snapshot => {
                const playerData = snapshot.val();

                firebase.storage().ref('players')
                .child(playerData.image).getDownloadURL()
                .then( url => {
                    this.updateFields(playerData,playerId,'Edit Player',url)
                }).catch( e=> {
                    this.updateFields({
                        ...playerData,
                        image: ''
                    },playerId,'Edit Player','')
                })
            })
        }
    }

    updateForm(element, content = ''){
        const newFormdata = {...this.state.formdata} 
        const newElement = {...newFormdata[element.id]}

        if(content === ''){
            newElement.value = element.event.target.value;
        } else {
            newElement.value = content
        }

        let validData = validate(newElement)
        newElement.valid = validData[0];
        newElement.validationMessage = validData[1];

        newFormdata[element.id] = newElement;

        this.setState({
            formError: false,
            formdata: newFormdata
        })
    }

    successForm = (message) => {
        this.setState({
            formSuccess: message
        });
        setTimeout(()=>{
            this.setState({
                formSuccess:''
            });
        },2000)
    }

    submitForm(event){
        event.preventDefault();

        let dataToSubmit = {};
        let formIsValid = true;

        //gets all the data from the forms
        for(let key in this.state.formdata){
            dataToSubmit[key]=this.state.formdata[key].value;
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }
        
        if(formIsValid){
            if(this.state.formType === 'Edit Player'){
                firebaseDB.ref(`players/${this.state.playerId}`)
                .update(dataToSubmit).then(()=>{
                    this.successForm('Update Correctly');
                }).catch(e=>{
                    this.setState({formError:true})
                })
            }else{
                firebasePlayers.push(dataToSubmit).then(()=>{
                    this.props.history.push('/admin_players')
                }).catch(e=>{
                    this.setState({
                        formError:true
                    })
                })
            }
        } else {
            this.setState({
                formError: true
            })
        }
    }

    resetImage = () => {
        const newFormdata = {...this.state.formdata}
        newFormdata['image'].value = '';
        newFormdata['image'].valid = false;
        this.setState({
            defaultImg: '',
            formdata: newFormdata
        })
    }

    storeFilename = (filename) => {
        this.updateForm({id:'image'},filename)
    }

    render() {
        console.log(this.state.formdata)
        return (
            <AdminLayout>
                <div className="editplayers_dialog_wrapper">
                    <h2>
                        {this.state.formType}
                    </h2>
                        <form onSubmit={(event)=> this.submitForm(event)}>

                            <Fileuploader
                                //store all the images in directory called players in DB storage
                                dir="players"
                                tag={"Player Image"}
                                defaultImg={this.state.defaultImg}
                                defaultImgName={this.state.formdata.image.value}
                                resetImage={()=> this.resetImage()}
                                filename={(filename)=> this.storeFilename(filename)}
                            />

                            <FormField
                                id={'name'}
                                formdata={this.state.formdata.name}
                                change={(element)=> this.updateForm(element)}
                            />
                            <FormField
                                id={'lastname'}
                                formdata={this.state.formdata.lastname}
                                change={(element)=> this.updateForm(element)}
                            />
                            <FormField
                                id={'number'}
                                formdata={this.state.formdata.number}
                                change={(element)=> this.updateForm(element)}
                            />
                            <FormField
                                id={'position'}
                                formdata={this.state.formdata.position}
                                change={(element)=> this.updateForm(element)}
                            />

                            <div className="sucess_label">{this.state.formSuccess}</div>
                                {this.state.formError ?
                                    <div className="error_label">
                                        Something is Wrong
                                    </div>
                                    : ''
                                }
                            <div className="admin_submit">
                                <button onClick={(event)=> this.submitForm(event)}>
                                    {this.state.formType}
                                </button>
                            </div>
                        
                        </form>
                </div>
            </AdminLayout>
        );
    }
}

export default AddEditPlayers;