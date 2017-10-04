'use strict';

let Vue = require('vue');
let axios = require('axios');
let _ = require('lodash');
window.Event = require('./event.js');

let Mousetrap = require('mousetrap');

let $ = require('jquery');
window.jQuery = $;
window.Tether = require('tether');
require('bootstrap');

import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const adapter = new LocalStorage('db')
const db = low(adapter)

module.exports = function () {

    Vue.prototype.$http = axios;

    let filename = 'config.json';

    let store = {
        debug: true,
        state: {
            strokes: 0,
            value: 0,
            gameOver: false,
            active: false
        }
    };

    Vue.component('game-options', {

        props: {
            options: {
                type: Array,
                default: () => [
                    {
                        name: "Strom",
                        value: "strom",
                    },
                    {
                        name: "Wasser",
                        value: "wasser",
                    }
                ]
            }
        },

        data() {
            return {
                state: store.state,
                selected: undefined
            };
        },

        template: `
            <div class="game-options" v-if="state.active">
                <select v-model="selected" class="form-control">
                    <option v-for="(option, index) in options" v-bind:value="option.value">
                        {{ option.name }}
                    </option>
                </select>
            </div>
        `,
    });

    Vue.component('game-display', {

        props: {
            type: {default: "strom"}
        },

        data() {
            return {
                state: store.state
            };
        },

        template: `
            <div class="game-display" v-if="state.active">
                <div class="visual" v-bind:data-value="state.value" v-bind:data-type="type"></div>
            </div>
        `,

        created() {
            Event.listen('loadedData', (data) => {
                this.options = data.options;
            });
        }
    });

    Vue.component('game-instructions', {
        props: {
            text: {default: "Press"}
        },

        data() {
            return {
                keys: []
            };
        },

        template: `
            <div class="game-instructions"
                v-if="keys.length">
                <h4>{{ text }}
                    <span class="buttons">
                        <span v-for="(key, index) in keys">
                            <span>{{key}}</span><span v-if="index+1 < keys.length">, </span>
                        </span>
                    </span>
                </h4>
            </div>
        `,

        created() {
            Event.listen('loadedData', (data) => {
                this.keys = data.keys;
            });
        }
    });

    Vue.component('game-buttons', {
        data() {
            return {
                keys: []
            };
        },

        template: `
                <div class="game-buttons"
                    v-if="keys.length">
                    <nav>
                        <ul>
                            <li v-for="(key, index) in keys">
                                <button v-on:click="press(key)" v-bind:id="'button-' + index"></button>
                            </li>
                        </ul>
                    </nav>
                </div>
   
        `,

        methods: {
            press(key) {
                for (let i = 0; i < this.keys.length; i++) {
                    if (this.keys[i] == key) {
                        Event.fire('keyPressed', i);
                    }
                }

            }
        },

        created() {
            Event.listen('loadedData', (data) => {
                this.keys = data.keys;
            });
        }
    });

    Vue.component('game-state', {
        props: {
            title: {default: "Hits:"}
        },

        data() {
            return {
                state: store.state
            };
        },

        template: `
            <div class="game-state" v-if="state.active">
                <small>{{ title }} {{ state.strokes }}</small>
            </div>
        `,
    });

    Vue.component('game-scores', {
        data() {
            return {
                state: store.state
            };
        },

        template: `
            <div class="game-scores">
            <button type="button"
                            class="btn btn-primary-outline  btn-block"
                            v-on:click="reset()">reset</button>
                            
                            
                <p v-if="state.gameOver">
                    <button type="button"
                            class="btn btn-primary-outline btn-lg btn-block"
                            v-on:click="restart()">
                        Nochmal spielen!
                    </button>
                </p>

                <table class="table" v-if="highscore.length">
                    <tr>
                        <th>Pos.</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                    <tr v-for="(player, index) in highscore">
                        <td>{{ index + 1 }}</td>
                        <td>{{ player.name }}</td>
                        <td>{{ player.strokes }}</td>
                    </tr>
                </table>

            </div>
        `,

        methods: {
            reset: function () {
                db.set('players', [])
                    .write()
            },

            restart: function () {
                Event.fire('shouldRestart');
            }
        },

        computed: {
            highscore: {
                // getter
                get: function () {
                    return db.get('players')
                        .sortBy('views')
                        .take(3)
                        .value();
                },
                // setter
                set: function (newValue) {


                    console.log("set")
                    console.log(newValue)

                    // this.highscore = newValue;
                }
            }
        },

        created() {


            Event.listen('playerAdded', (player) => {
                db.get('players')
                    .push(player)
                    .write();
                
                this.highscore = [player];
            });
        }
    });

    Vue.component('sharing', {
        props: {
            title: {default: "Share now"}
        },

        data() {
            return {
                options: [
                    {
                        name: "facebook",
                        icon: "fa-facebook-official",
                        href: "https://www.facebook.com/share.php?u=" + window.location
                    },
                    {
                        name: "twitter",
                        icon: "fa-twitter",
                        href: "https://twitter.com/home?status=" + window.location
                    },
                    {
                        name: "whatsapp",
                        icon: "fa-whatsapp",
                        href: "whatsapp://send?text=" + window.location,
                        action: "share/whatsapp/share"
                    }
                ]
            };
        },

        template: `
            <div class="sharing">
                <h2>{{ title }}</h2>
                
                <nav>
                    <ul>
                        <li v-for="option in options">
                            <a v-bind:href="option.href" v-on:click.stop.prevent="share(option.href, 'foo')" v-bind:data-action="option.action">
                                <i class="fa" v-bind:class="option.icon"></i>
                            </a>        
                        </li>
                    </ul>
                </nav>
                
                
            </div>
        `,

        methods: {
            share(url, title) {
                window.open(url, title, "height=300,width=400");
            }
        }
    });

    Vue.component('modal', {
        props: {
            headline: {
                default: 'Super!'
            }
        },

        data() {
            return {
                state: store.state,
                player: {
                    name: "foo",
                    email: "foo@bar.de"
                }
            };
        },

        template: `
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 class="modal-title" id="myModalLabel">{{ headline }}</h4>
                        </div>
                        <form v-on:submit.prevent="submit">
                            <div class="modal-body">
                                <p class="lead">Sie haben mit nur <strong>{{ state.strokes }}</strong> Klicks das
                                    Ziel
                                    erreicht!</p>
                                <p>Tragen Sie Ihrem Namen in unsere Highscore-Liste ein und gewinnsen sie tolle
                                    Preise:</p>
                                <fieldset class="form-group">
                                    <p><input type="text"
                                    name="name"
                                           class="form-control"
                                           v-model="player.name"
                                           placeholder="Unnamed Player"></p>
                                    <p><input type="email"
                                    name="email"
                                           class="form-control"
                                           v-model="player.email"
                                           placeholder="player@example.com"></p>
                                </fieldset>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Schließen</button>
                                <input type="submit" class="btn btn-primary" :disabled="validated == 0">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `,

        methods: {
            submit: function (event) {
                event.preventDefault();
                this.player.strokes = this.state.strokes;
                Event.fire('playerAdded', this.player);
            }
        },

        computed: {
            validated: function () {
                return this.player.name != "" && this.player.email != "";
            }
        },

        created() {
            Event.listen('playerAdded', (player) => {
                // $('#myModal').modal('hide');
            });
        },

        mounted() {
            $('#myModal').modal();
        }
    });

    let app = new Vue({

        el: '#app',

        data() {
            return {
                debug: store.debug,
                state: store.state,
                active: false,
                floor: 0,
                ceil: 100,
                interval: 250,
                incrementValue: 5,
                keysPressed: [],
                keys: [],
                timer: undefined
            }
        },

        created() {
            let self = this;

            db.defaults({players: []})
                .write()

            this.fetchData();

            Event.listen('loadedData', (data) => {
                self.keys = data.keys;

                if (data.floor) {
                    this.floor = data.floor;
                }

                if (data.ceil) {
                    this.ceil = data.ceil;
                }

                if (data.interval) {
                    this.interval = data.interval;
                }

                if (data.incrementValue) {
                    this.incrementValue = data.incrementValue;
                }

                for (let i = 0; i < data.keys.length; i++) {
                    self.keysPressed[i] = false;
                }

                this.bindKeys();

                self.state.active = true;

                this.start();
            });

            Event.listen('keyPressed', (key) => {

                if (!this.state.gameOver) {
                    let keyPressAllowed = true;

                    for (let i = 0; i < key; i++) {
                        keyPressAllowed = this.keysPressed[i];
                    }

                    if (keyPressAllowed) {
                        this.keysPressed[key] = true;

                        if (key == this.keys.length - 1) {
                            Event.fire('hitRegistered');
                        }
                    }
                }

            });

            Event.listen('hitRegistered', () => {
                this.keysPressed = [];

                this.state.strokes++;
                this.state.value += this.incrementValue;

                if (this.state.value >= this.ceil) {
                    this.state.value = this.ceil;
                    Event.fire('gameOver');
                }
            });

            Event.listen('gameOver', () => {
                clearTimeout(this.timer);
                Mousetrap.reset();
                $('button').removeClass('active');

                this.state.gameOver = true;

                $('#myModal').modal();
            });

            Event.listen('shouldRestart', () => {
                this.bindKeys();
                this.start();
            });
        },

        methods: {
            fetchData: function (el) {
                if (window.config) {
                    Event.fire('loadedData', window.config);
                } else {
                    this.$http.get(filename)
                        .then(function (response) {
                            Event.fire('loadedData', response.data);
                            // console.log(response.data);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }

            },

            bindKeys: function () {
                for (let i = 0; i < this.keys.length; i++) {
                    Mousetrap.bind(this.keys[i], function () {
                        $('#button-' + i).addClass('active');
                        Event.fire('keyPressed', i);
                    });

                    Mousetrap.bind(this.keys[i], function () {
                        $('button').removeClass('active');
                    }, 'keyup');
                }
            },

            start: function () {
                var self = this;

                this.state.gameOver = false;
                this.state.value = this.floor;
                this.state.strokes = 0;

                setTimeout(function () {
                    self.decrementScore();
                }, this.interval);
            },

            decrementScore: function () {
                var self = this;

                if (this.state.value > this.floor) {
                    this.state.value--;
                }

                this.timer = setTimeout(function () {
                    self.decrementScore();
                }, this.interval);
            }
        }

    });
};