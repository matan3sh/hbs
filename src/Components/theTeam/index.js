import React, { Component } from 'react';
import PlayerCard from '../ui/playerCard';
import Fade from 'react-reveal/Fade';

import Stripes from '../../Resources/images/stripes.png';
import { firebasePlayers, firebase } from '../../firebase';
import { firebaseLooper } from '../ui/misc';
import { Promise } from 'core-js';
  
class TheTeam extends Component {

    state = {
        loading:true,
        players:[]
    }

    componentDidMount(){
        firebasePlayers.once('value').then(snapshot =>{
            const players = firebaseLooper(snapshot);
            let promises = [];
            
            for(let key in players){
                promises.push(
                    new Promise((resolve,reject)=>{
                        firebase.storage().ref('players')
                        .child(players[key].image).getDownloadURL()
                        .then( url => {
                            players[key].url = url;
                            resolve();
                        })
                    })
                )
            }

            Promise.all(promises).then(()=>{
                this.setState({
                    loading: false,
                    players
                })
            })



        })
    }

    showplayersByCategory = (category) => (
        this.state.players ?
            this.state.players.map((player,i)=>{
                return player.position === category ?
                    <Fade left delay={i*20} key={i}>
                        <div className="item">
                            <PlayerCard
                                number={player.number}
                                name={player.name}
                                lastname={player.lastname}
                                bck={player.url}
                            />
                        </div>
                    </Fade>
                :null
            })
        :null
    )


    render() {
        return (
            <div className="the_team_container"
                style={{
                    background:`url(${Stripes}) repeat`
                }}
            >
                { !this.state.loading ?
                    <div>
                        <div className="team_category_wrapper">
                            <div className="title">Point Guards</div>
                            <div className="team_cards">
                                {this.showplayersByCategory('Point Guard')}
                            </div>
                        </div>

                        <div className="team_category_wrapper">
                            <div className="title">Second Guards</div>
                            <div className="team_cards">
                                {this.showplayersByCategory('Second Guard')}
                            </div>
                        </div>

                        <div className="team_category_wrapper">
                            <div className="title">Small Forwards</div>
                            <div className="team_cards">
                                {this.showplayersByCategory('Small Forward')}
                            </div>
                        </div>

                        <div className="team_category_wrapper">
                            <div className="title">Power Forwards</div>
                            <div className="team_cards">
                                {this.showplayersByCategory('Power Forward')}
                            </div>
                        </div>

                        <div className="team_category_wrapper">
                            <div className="title">Centers</div>
                            <div className="team_cards">
                                {this.showplayersByCategory('Center')}
                            </div>
                        </div>

                    </div>
                    :null
                }
                
            </div>
        );
    }
}

export default TheTeam;