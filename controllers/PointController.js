const Point = require("../models/Point");

const listarPontos = async (req, res) => {
    const Points = await Point.findAll()
    res.status(200).send(Points)
};

const salvarPonto = async (req, res) => {
    const obj = {
        descricao: req.body.nome,
        geometria: {
            type: 'Point',
            coordinates: [req.body.lng, req.body.lat]
        }
    }
    console.log(obj);
    const point = await Point.create(obj)
        .catch(() => {
            res.status(400).send("Falha ao salvar")
        })
    if (point) {
        res.status(201).send("Ponto criado")
    }
    // Point.save().then(() => {
    //     res.status(201).send("Ponto criado")
    // }).catch(() => {
    //     res.status(400).send("Falha ao salvar")
    // })
}

const sincronizar = async (req, res) => {
    await Point.sync();
    res.status(200).send("Sincronizado")
}

module.exports = { listarPontos, salvarPonto, sincronizar };
