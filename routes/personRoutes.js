const router = require("express").Router();

const Person = require('../models/Person');

router.post('/', async (req, res) => {

    // Usando destructuring, para criar 3 variaveis e receber os valores correspondentes ao seus nomes
    const {name, salary, approved } = req.body

    if (!name) {
        res.status(422).json({erro:'O nome é obrigatório'});
        return;
    }

    const person = {
        name, 
        salary, 
        approved
    }

    try{
        await Person.create(person);

        res.status(201).json({message: 'Pessoa inserida no sistema com sucesso!'});

    } catch (erro) {
        res.status(500).json({erro: erro});
    }

});

router.get('/', async (req, res) => {

    try {
        const people = await Person.find();
        res.status(200).json(people);
    } catch (erro) {
        res.status(500).json({erro: erro});
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const person = await Person.findOne({_id: id});

        if (!person) {
            res.status(422).json({erro:'O usuário não foi encontrado'});
            return;
        }

        res.status(200).json(person)
    } catch (erro) {
        res.status(500).json({erro: erro});
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    const {name, salary, approved } = req.body

    const person = {
        name, 
        salary, 
        approved
    }

    try {
        const updatedPerson = await Person.updateOne({_id: id}, person); 

        if (updatedPerson.matchedCount === 0) {
            res.status(422).json({message: 'O usuário não foi encontrado'})
            return 
        }

        res.status(200).json(person);
    } catch (erro) {
        res.status(500).json({erro: erro})          
    }

});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const person = await Person.findOne({_id: id});

    if (!person) {
            res.status(422).json({erro:'O usuário não foi encontrado'});
            return;
        }

    try {
        await Person.deleteOne({_id: id});
        res.status(200).json({message: 'Usuario removido com sucesso!'})
    } catch (erro) {
        res.status(500).json({erro: erro});
    }
})

module.exports = router;