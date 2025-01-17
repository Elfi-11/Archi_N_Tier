exports.seed = function(knex) {
    // Supprime toutes les entrées existantes
    return knex('themes').del()
    .then(function () {
        // Insère les thèmes
        return knex('themes').insert([
        {
            id: 1,
            nom_theme: "Médical",
            description: "Questions sur l'anatomie et la santé humaine"
        },
        {
            id: 2,
            nom_theme: "Mathématiques",
            description: "Questions sur les mathématiques",
        },
        {
            id: 3,
            nom_theme: "Sciences",
            description: "Questions sur les sciences",
        },
        {
            id: 4,
            nom_theme: "Informatique",
            description: "Questions sur l'informatique",
        },
        ]);
    });
};
