exports.seed = function(knex) {
    // Supprime toutes les entrées existantes
    return knex('questions').del()
    .then(function () {
        // Insère les questions
        return knex('questions').insert([
        {
            question: "Quel est le plus grand organe du corps humain ?",
            reponse1: "Le cœur",
            reponse2: "La peau",
            reponse3: "Le foie",
            reponse4: "Les poumons",
            bonne_reponse: 2
        },
        {
            question: "Quelle est la principale fonction des globules rouges ?",
            reponse1: "Combattre les infections",
            reponse2: "Transporter l'oxygène",
            reponse3: "Coaguler le sang",
            reponse4: "Produire des anticorps",
            bonne_reponse: 2
        },
        {
            question: "Quel est le principal muscle de la respiration ?",
            reponse1: "Le diaphragme",
            reponse2: "Le muscle droit de l'abdomen",
            reponse3: "Le muscle pectoral",
            reponse4: "Le muscle intercostal",
            bonne_reponse: 1
        },
        {
            question: "Quel signe clinique est souvent associé à l'hypertension artérielle ?",
            reponse1: "Vertiges",
            reponse2: "Évanouissements",
            reponse3: "Maux de tête",
            reponse4: "Fatigue",
            bonne_reponse: 3
        },
        {
            question: "Quelle structure du système nerveux central est responsable de la coordination des mouvements ?",
            reponse1: "Le cortex cérébral",
            reponse2: "Le cervelet",
            reponse3: "Le tronc cérébral",
            reponse4: "La moelle épinière",
            bonne_reponse: 2
        },
        {
            question: "Quel est le principal signe clinique de l'infarctus du myocarde ?",
            reponse1: "Douleur thoracique",
            reponse2: "Essoufflement",
            reponse3: "Nausées",
            reponse4: "Palpitations",
            bonne_reponse: 1
        },
        {
            question: "Quelle hormone est principalement produite par le pancréas pour réguler la glycémie ?",
            reponse1: "Insuline",
            reponse2: "Glucagon",
            reponse3: "Adrénaline",
            reponse4: "Cortisol",
            bonne_reponse: 1
        },
        {
            question: "Quel est le principal symptôme de l'asthme ?",
            reponse1: "Toux",
            reponse2: "Difficulté à respirer",
            reponse3: "Douleur thoracique",
            reponse4: "Écoulement nasal",
            bonne_reponse: 2
        },
        {
            question: "Quelle est la fonction principale des reins ?",
            reponse1: "Produire des hormones",
            reponse2: "Éliminer les déchets du sang",
            reponse3: "Réguler la température corporelle",
            reponse4: "Absorber les nutriments",
            bonne_reponse: 2
        },
        {
            question: "Quel est le signe clinique typique d'une réaction allergique ?",
            reponse1: "Éruption cutanée",
            reponse2: "Frissons",
            reponse3: "Fièvre",
            reponse4: "Mal de tête",
            bonne_reponse: 1
        }
        ]);
    });
};
