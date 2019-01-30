<template>
    <v-ons-page>
        <p style="text-align: center">
            <span v-show="!existsItemsOnList" style="text-wrap: wrap">
                Nenhuma regra encontrada. Clique em <v-ons-icon icon="md-refresh" style="color: #62b8f1;"></v-ons-icon> para atualizar!
            </span>
            <v-ons-list v-show="existsItemsOnList">
                <v-ons-list-header> Regras para Horários de Agendamento </v-ons-list-header>
                <v-ons-list-item v-for="(rule, h) in lista" :key="h" expandable :expanded.sync="lista[h].expanded">
                    {{ (rule.type).toUpperCase() }}
                    <div class="expandable-content">
                        <span v-if="rule.type == 'weekly'">
                            Dias: [ <span v-for="(weekDay, wd) in rule.data.days" :key="wd"> {{ weekDays[weekDay] }} </span> ]
                        </span>

                        <span v-if="rule.type == 'single-day'">
                            Dia: {{ rule.data.day }}
                        </span>

                        <span v-if="rule.type == 'daily'">
                            Dias: Todos os dias
                        </span>
                        <ul style="list-style:none;">
                            <li style="background-color: #f4f4f4;" v-for="(interval, int) in rule.data.intervals" :key="int"> {{ interval.start }} - {{ interval.end }} </li>
                        </ul>

                        <div class="row">
                            <div style="display: flex; justify-content: space-around;">
                                <button @click="removerRegra(rule.id)" class="btn waves-effect waves-light red" type="submit" name="action">Excluir
                                    <i class="material-icons right">close</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </v-ons-list-item>
            </v-ons-list>

            <v-ons-fab @click="goNovaRegra()" position="bottom right" :visible="fabVisible">
                <v-ons-icon icon="md-plus" style="color: #62b8f1;"></v-ons-icon>
            </v-ons-fab>

            <v-ons-fab v-show="!existsItemsOnList" @click="requestLista()" position="bottom left" :visible="fabVisible">
                <v-ons-icon icon="md-refresh" style="color: #62b8f1;"></v-ons-icon>
            </v-ons-fab>
        </p>
    </v-ons-page>
</template>

<style>
.dialog-container--material {
    border-radius: 2px;
    background-color: #efeff4 !important;
    color: #1f1f21;
}
</style>


<script>
import axios from 'axios'

export default {
    data () {
        return {
            expanded: true,
            fabVisible: true,
            lista: [],
            weekDays: [
                'Domingo',
                'Segunda',
                'Terça', 
                'Quarta',
                'Quinta',
                'Sexta', 
                'Sábado',
            ]
        }
    },
    watch: {},
    beforeMount (){
        this.requestLista()
    },
    computed: {
        existsItemsOnList() {
            return this.lista.length > 0 ? true : false
        }
    },
    methods: {
        requestLista() {
            axios.get(this.$root.$data.baseUrl + '/list/scheduling/rules')
            .then( response => {
                this.lista = response.data
                this.lista.forEach( element => {
                    element.expanded = false
                });
            })
        },
        removerRegra( id ){
            axios.post(this.$root.$data.baseUrl + '/remove/scheduling/rule/' + id, {})
            .then( response => {
                if( response.data.status == 200 ) {
                    this.requestLista()
                }
            })
        },
        goNovaRegra(){
            this.$router.push({
                name: 'nova_regra'
            })
        }
    }
}
</script>

