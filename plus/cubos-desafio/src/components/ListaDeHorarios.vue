<template id="lista_de_horarios">
    <v-ons-page>
        <p style="text-align: center">
            <form>
                <div class="row">
                    <div class="col s6">
                        <label> Inicio </label>
                        <input v-model="inicio" type="date" class="validate">
                    </div>
                    <div class="col s6">
                        <label> Final </label>
                        <input v-model="final" type="date" class="validate">
                    </div>
                </div>
            </form>

            <v-ons-fab @click="buscar()" position="bottom right" :visible="true">
                <v-ons-icon icon="md-refresh" style="color: #62b8f1;"></v-ons-icon>
            </v-ons-fab>

            <v-ons-list v-show="existsItemsOnList">
                <v-ons-list-header> Horários Disponíveis para agendamento </v-ons-list-header>
                <v-ons-list-item v-for="(data, h) in lista" :key="h" expandable :expanded.sync="data.expanded">
                    {{ data.day }}
                    <div class="expandable-content">
                        <ul style="list-style:none;">
                            <li style="background-color: #f4f4f4;" v-for="(interval, int) in data.intervals" :key="int"> {{ interval.start }} - {{ interval.end }} </li>
                        </ul>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
        </p>
    </v-ons-page>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            expanded: true,
            inicio: '',
            final: '',
            lista: []
        }
    },
    computed: {
        existsItemsOnList() {
            return this.lista.length > 0 ? true : false
        }
    },
    methods: {
        buscar() {
            if( this.inicio != '' && this.final != '' ) {
                let date_inicio     = new Date(this.inicio);
                let date_final      = new Date(this.final)

                let new_date_inicio = {
                    day: ("0" + (date_inicio.getUTCDate())).slice(-2),
                    month: ("0" + (date_inicio.getUTCMonth() + 1)).slice(-2),
                    year: date_inicio.getUTCFullYear(),
                    getString(){
                        return `${this.day}-${this.month}-${this.year}`        
                    }
                }

                let new_date_final = {
                    day: ("0" + (date_final.getUTCDate())).slice(-2),
                    month: ("0" + (date_final.getUTCMonth() + 1)).slice(-2),
                    year: date_final.getUTCFullYear(),
                    getString(){
                        return `${this.day}-${this.month}-${this.year}`        
                    }
                }

                axios
                    .get(this.$root.$data.baseUrl + `/list/freetime?start=${new_date_inicio.getString()}&end=${new_date_final.getString()}`)
                    .then( response => {
                        console.log( response )
                        this.lista = response.data
                        this.lista.forEach(element => {
                            element.expanded = false;
                        });
                    })

                console.log("início: " + new_date_inicio.getString() + ", final: " + new_date_final.getString())
            }
        }
    }
}
</script>

