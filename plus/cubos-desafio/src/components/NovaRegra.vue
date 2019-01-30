<template>
    <v-ons-page>
        <v-ons-toolbar style="background-color: #62b8f1;">
            <div class="center" style="color: white;"> Nova Regra </div>
            <div class="left" @click="goBackRegras()">
                <v-ons-toolbar-button style="color: white;" icon="ion-navicon, material: md-arrow-left"></v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>

        <p style="text-align: center; overflow: scroll;" >
            <v-ons-list>
                <v-ons-list-item>
                    <label>Browser Select</label>
                    <select class="browser-default" v-model="selectedItem">
                        <option value="0" disabled selected>Choose your option</option>
                        <option class="row" v-for="(item, i) in type_options" :key="i" :value="item.value">
                            {{ item.text }}
                        </option>
                    </select>
                </v-ons-list-item>

                <v-ons-list-item v-if="selectedItem == 'daily'">
                    <div class="row">
                        <form class="col s12">
                            <div class="row" v-for="(interval, inter) in getSelectedType.intervals" :key="inter">
                                <div v-if="interval.button" class="input-field col s4">
                                    <input :id="'intervals-de-' + inter" v-model="interval.start" type="text" class="validate">
                                    <label :for="'intervals-de-' + inter">De</label>
                                </div>
                                <div v-if="interval.button" class="input-field col s4">
                                    <input :id="'intervals-ate-' + inter" v-model="interval.end" type="text" class="validate">
                                    <label :for="'intervals-ate-' + inter">Até</label>
                                </div>

                                <div v-if="interval.button" class="input-field col s2">
                                    <a @click="novoIntervalo(interval, inter)" class="btn-floating"><i class="material-icons">add</i></a>
                                </div>

                                <div v-if="!interval.button" style="display: flex;justify-content: space-between;margin: 0px 15px;padding: 0px;">
                                    <span> {{ interval.start + ' - ' + interval.end }} </span>
                                    <a @click="apagaIntervalo(inter)"><i class="material-icons">close</i></a>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s4 offset-s4" style="margin-top: 20px;">
                                    <a @click="enviarRule()" class="waves-effect waves-light btn"> Enviar </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </v-ons-list-item>

                <v-ons-list-item v-else-if="selectedItem == 'weekly'">
                    <div class="row">
                        <form class="col s12">
                            <div class="row">
                                <div class="switch col s12" v-for="(day, d) in weekly.days" :key="d">
                                    <label>
                                    {{ day.dia }}
                                    <input v-model="weekly.days[d].check" type="checkbox" :checked="weekly.days[d].check ? 'checked' : ''" />
                                    <span class="lever"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="row" v-for="(interval, inter) in getSelectedType.intervals" :key="inter">
                                <div v-if="interval.button" class="input-field col s4">
                                    <input :id="'intervals-de-' + inter" v-model="interval.start" type="text" class="validate">
                                    <label :for="'intervals-de-' + inter">De</label>
                                </div>
                                <div v-if="interval.button" class="input-field col s4">
                                    <input :id="'intervals-ate-' + inter" v-model="interval.end" type="text" class="validate">
                                    <label :for="'intervals-ate-' + inter">Até</label>
                                </div>

                                <div v-if="interval.button" class="input-field col s2">
                                    <a @click="novoIntervalo(interval, inter)" class="btn-floating"><i class="material-icons">add</i></a>
                                </div>

                                <div v-if="!interval.button" style="display: flex;justify-content: space-between;margin: 0px 15px;padding: 0px;">
                                    <span> {{ interval.start + ' - ' + interval.end }} </span>
                                    <a @click="apagaIntervalo(inter)"><i class="material-icons">close</i></a>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col s4 offset-s4" style="margin-top: 20px;">
                                    <a @click="enviarRule()" class="waves-effect waves-light btn"> Enviar </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </v-ons-list-item>

                <v-ons-list-item v-else-if="selectedItem == 'single-day'">
                    <div class="row">
                        <form class="col s12">
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="date" v-model="data_field" type="date" class="validate">
                                    <label for="date">Data</label>
                                </div>
                            </div>
                            <div class="row" v-for="(interval, inter) in getSelectedType.intervals" :key="inter">
                                <div v-if="interval.button" class="input-field col s4">
                                    <input :id="'intervals-de-' + inter" v-model="interval.start" type="text" class="validate">
                                    <label :for="'intervals-de-' + inter">De</label>
                                </div>
                                <div v-if="interval.button" class="input-field col s4">
                                    <input :id="'intervals-ate-' + inter" v-model="interval.end" type="text" class="validate">
                                    <label :for="'intervals-ate-' + inter">Até</label>
                                </div>

                                <div v-if="interval.button" class="input-field col s2">
                                    <a @click="novoIntervalo(interval, inter)" class="btn-floating"><i class="material-icons">add</i></a>
                                </div>

                                <div v-if="!interval.button" style="display: flex;justify-content: space-between;margin: 0px 15px;padding: 0px;">
                                    <span> {{ interval.start + ' - ' + interval.end }} </span>
                                    <a @click="apagaIntervalo(inter)"><i class="material-icons">close</i></a>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col s4 offset-s4" style="margin-top: 20px;">
                                    <a @click="enviarRule()" class="waves-effect waves-light btn"> Enviar </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
        </p>
    </v-ons-page>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            dialogVisible: false,
            data_field: '',
            type_options: [
                { text: 'Diariamente', value: 'daily' },
                { text: 'Semanalmente', value: 'weekly' },
                { text: 'Dia Específico', value: 'single-day' }
            ],
            selectedItem: 'daily',
            daily: {
                type: 'daily',
                intervals: [{start: '', end: '', button: true}]
            },
            weekly: {
                type: 'weekly',
                days: [
                    {dia: 'Domingo', value: 0, check: false},
                    {dia: 'Segunda', value: 1, check: false},
                    {dia: 'Terça', value: 2, check: false},
                    {dia: 'Quarta', value: 3, check: false},
                    {dia: 'Quinta', value: 4, check: false},
                    {dia: 'Sexta', value: 5, check: false},
                    {dia: 'Sábado', value: 6, check: false}
                ],
                intervals: [{start: '', end: '', button: true}]
            },
            'single-day': {
                type: 'single-day',
                day: '',
                intervals: [{start: '', end: '', button: true}]
            }
        }
    },
    watch: {
        dialogVisible( value ){
            if( !value ) {
                this.data_field = '';
            }
        }
    },
    computed: {
        getDate() {
            if( this.data_field != '' ) {
                let date    = new Date(this.data_field);
                let day     = ("0" + (date.getUTCDate())).slice(-2)
                let month   = ("0" + (date.getUTCMonth() + 1)).slice(-2)
                let year    = date.getUTCFullYear()
                console.log( date )
                return `${day}-${month}-${year}`
            }
        },
        getSelectedType() {
            switch( this.selectedItem ) {
                case 'daily':
                    return this.daily
                    break;
                case 'weekly':
                    return this.weekly
                    break;
                case 'single-day':
                    return this['single-day']
                    break;
            }
        }
    },
    methods: {
        apagaIntervalo(i) {
            let new_array = []
            switch( this.selectedItem ) {
                case 'daily':
                    if( this.daily.intervals.length > 1 ) { 
                        this.daily.intervals.forEach( (elem, _i) => {
                            if( _i !== i ) {
                                new_array.push( elem )
                            }
                        });
                        this.daily.intervals = new_array
                    }
                    break;

                case 'weekly':
                    if( this.weekly.intervals.length > 1 ) {
                        this.weekly.intervals.forEach( (elem, _i) => {
                            if( _i !== i ) {
                                new_array.push( elem )
                            }
                        });
                        this.weekly.intervals = new_array
                    }
                    break;

                case 'single-day':
                    if( this['single-day'].intervals.length > 1 ) { 
                        this['single-day'].intervals.forEach( (elem, _i) => {
                            if( _i !== i ) {
                                new_array.push( elem )
                            }
                        });
                        this['single-day'].intervals = new_array
                    }
                    break;

            }

            this.daily
        },
        novoIntervalo( interval, i ) {
            let index = i > 0 ? i : 0;

            if( this.checkPreenchido(interval.start, interval.end) ) {
                switch( this.selectedItem ) {
                    case 'daily':
                        this.daily.intervals[i].button = false
                        this.daily.intervals.push( {start: '', end: '', button: true} )
                        break;

                    case 'weekly':
                        this.weekly.intervals[i].button = false
                        this.weekly.intervals.push( {start: '', end: '', button: true} )
                        break;

                    case 'single-day':
                        this['single-day'].intervals[i].button = false
                        this['single-day'].intervals.push( {start: '', end: '', button: true} )
                        break;

                }
            }
            else {
                alert('Precisa estar preenchido')
            }
        },
        checkPreenchido(a, b) {
            if( a == '' || b == '' ) {
                return false;
            }else {
                return true;
            }
        },



        enviarRule(){
            let url = this.$root.$data.baseUrl + '/register/scheduling/rule'
            switch( this.selectedItem ) {
                case 'daily':
                    axios({
                        method: 'post',
                        url,
                        data: {
                            type: 'daily',
                            data: {
                                intervals: this.daily.intervals
                            }
                        }
                    }).then( response => {
                        if( response.status == 200 ){
                            alert(response.data.msg)
                        }
                    })
                    break;
                case 'weekly':
                    let _days = []
                    this.weekly.days.forEach( day => {
                        if( day.check ) {
                            _days.push( day.value )
                        }
                    });
                    axios({
                        method: 'post',
                        url,
                        data: {
                            type: 'weekly',
                            data: {
                                days: _days,
                                intervals: this.weekly.intervals
                            }
                        }
                    }).then( response => {
                        if( response.status == 200 ){
                            alert(response.data.msg)
                        }
                    })
                    break;
                case 'single-day':
                    axios({
                        method: 'post',
                        url,
                        data: {
                            type: 'single-day',
                            data: {
                                day: this.getDate,
                                intervals: this['single-day'].intervals
                            }
                        }
                    }).then( response => {
                        if( response.status == 200 ){
                            alert(response.data.msg)
                        }
                    })
                    break;
            }
        },

        goBackRegras() {
            this.$root.$data.index = 1;
            this.$router.push({
                name: 'MainNavigator'
            })
        }
    }
}
</script>
