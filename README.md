# Desafio [Cubos IO](https://cubos.io)

# API de Gerenciamento de Clínica
A Api se encontra dentro da pasta desafio

Obs: [Descrição do desafio](Desafio.md)

### Comando para iniciar a api
Obs: Entrar na pasta `desafio/` <br>

Instalar os pacotes do package.json com o comando:
```$ npm install```

Depois é só iniciar o servidor
```$ npm run dev```

## Endpoints:
### Cadastro de regra de atendimento
Url: http://localhost:3000/register/scheduling/rule <br>
Method: POST <br>
Body: 
```json
{
    "type": "daily",
    "data": {
        "day": "25-06-2018",
        "intervals": [
            {"start":"09:00" , "end":"17:00"}
        ]
    }
}
```

Obs: Abaixo modelos para cada tipo requisitado no documento do desafio

- Um dia especifico:
```json
{
    "type": "single-day",
    "data": {
        "day": "25-06-2018",
        "intervals": [
            {"start":"09:30" , "end":"10:20"},
            {"start":"10:30" , "end":"11:00"}
        ]
    }
}
```
- Diáriamente: 
```json
{
    "type": "daily",
    "data": {
        "intervals": [
            {"start": "09:30", "end": "10:10"}
        ]
    }
}
```
- Semanalmente
```json
{
    "type": "weekly",
    "data": {
    	"days": [1, 3],
        "intervals": [
            {"start": "14:00", "end": "15:30"}
        ]
    }
}
```
Obs: A legenda para os days é...
<ul>
    <li> 0: domingo </li>
    <li> 1: segunda </li>
    <li> 2: terça </li>
    <li> 3: quarta </li>
    <li> 4: quinta </li>
    <li> 5: sexta </li>
    <li> 6: sábado </li>
</ul>

### Uma Observaçäo sobre conflito de horários
Caso seja adicionado um daily com intervalos das 08:00 às 17:00
E depois adicionado um weekly nas segundas com intervalos das 19:00 às 20:00, ou ainda um single-day em um dia que já esteja sendo cobrido por outra regra, a api irá adicionar esses intervalos todos juntos nessa mesma data. Seguindo o exemplo usado acima teriamos:

```json
{
    "type": "single-day",
    "data": {
        "day": "07-01-2019",
        "intervals": [
            {"start":"08:00" , "end":"09:00"},
        ]
    }
}

{
    "type": "daily",
    "data": {
        "intervals": [
            {"start": "09:30", "end": "10:10"}
        ]
    }
}

{
    "type": "weekly",
    "data": {
    	"days": [1, 3],
        "intervals": [
            {"start": "14:00", "end": "15:00"}
        ]
    }
}
```

Obs:  07-01-2019 é uma segunda
Temos aqui um cenário em que:

    Dia 07 existe horario para agendamento das 08:00 às 09:00 por conta de uma regra single-day ( Dia Específico )

    Dia 07 existe horario para agendamento das 09:30 às 10:10 por
    conta de uma regra daily (Diária)

    Dia 07 existe horario para agendamento das 14:00 às 15:00 por
    conta de uma regra weekly (Semanal)


Teríamos então o seguinte objeto:
```json
{
    "day": "07-01-2019",
    "intervals": [
        {
            "start":"08:00",
            "end":"09:00"
        },
        {
            "start": "09:30", 
            "end": "10:10"
        },
        {   
            "start": "14:00", 
            "end": "15:00"
        }
    ]
}
```


### Apagar regra
Url: http://localhost:3000/remove/scheduling/rule/{id} <br>
Method: POST <br>
Body: {}

Obs: {id} trata-se do valor de ID da regra que se quer remover

### Listar regras
Url: http://localhost:3000/remove/scheduling/rules <br>
Method: GET <br>

### Horários disponíveis
Url: http://localhost:3000/list/freetime?start=01-01-2019&end=31-01-2019 <br>
Method: GET <br>

Leve em consideraçäo que em: 
'?start=01-01-2019&end=31-01-2019'

- A query "start" se trata da data de inicio do intervalo de datas
- A query "end" se trata da data final do intervalo de datas

# Plus
Fiz um rascunho de como ficaria uma aplicativo para consumir essa API

## Comandos para rodar o aplicativo
- Entrar na pasta `plus/cubos-desafio`
- Instalar os pacotes do package.json com o comando: ```$ npm install```
- Iniciar o servidor: ```$ npm run dev```
- Abrir o browser no endereço: ```http://localhost:8080```

Obs: O servidor da api precisa também estar rodando pro funcionamento da aplicação mobile



