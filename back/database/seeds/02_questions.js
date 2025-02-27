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
            bonne_reponse: 2,
            theme_id: 1
        },
        {
            question: "Quelle est la principale fonction des globules rouges ?",
            reponse1: "Combattre les infections",
            reponse2: "Transporter l'oxygène",
            reponse3: "Coaguler le sang",
            reponse4: "Produire des anticorps",
            bonne_reponse: 2,
            theme_id: 1
        },
        {
            question: "Quel est le principal muscle de la respiration ?",
            reponse1: "Le diaphragme",
            reponse2: "Le muscle droit de l'abdomen",
            reponse3: "Le muscle pectoral",
            reponse4: "Le muscle intercostal",
            bonne_reponse: 1,
            theme_id: 1
        },
        {
            question: "Quel signe clinique est souvent associé à l'hypertension artérielle ?",
            reponse1: "Vertiges",
            reponse2: "Évanouissements",
            reponse3: "Maux de tête",
            reponse4: "Fatigue",
            bonne_reponse: 3,
            theme_id: 1
        },
        {
            question: "Quelle structure du système nerveux central est responsable de la coordination des mouvements ?",
            reponse1: "Le cortex cérébral",
            reponse2: "Le cervelet",
            reponse3: "Le tronc cérébral",
            reponse4: "La moelle épinière",
            bonne_reponse: 2,
            theme_id: 1
        },
        {
            question: "Quel est le principal signe clinique de l'infarctus du myocarde ?",
            reponse1: "Douleur thoracique",
            reponse2: "Essoufflement",
            reponse3: "Nausées",
            reponse4: "Palpitations",
            bonne_reponse: 1,
            theme_id: 1
        },
        {
            question: "Quelle hormone est principalement produite par le pancréas pour réguler la glycémie ?",
            reponse1: "Insuline",
            reponse2: "Glucagon",
            reponse3: "Adrénaline",
            reponse4: "Cortisol",
            bonne_reponse: 1,
            theme_id: 1
        },
        {
            question: "Quel est le principal symptôme de l'asthme ?",
            reponse1: "Toux",
            reponse2: "Difficulté à respirer",
            reponse3: "Douleur thoracique",
            reponse4: "Écoulement nasal",
            bonne_reponse: 2,
            theme_id: 1
        },
        {
            question: "Quelle est la fonction principale des reins ?",
            reponse1: "Produire des hormones",
            reponse2: "Éliminer les déchets du sang",
            reponse3: "Réguler la température corporelle",
            reponse4: "Absorber les nutriments",
            bonne_reponse: 2,
            theme_id: 1
        },
        {
            question: "Quel est le signe clinique typique d'une réaction allergique ?",
            reponse1: "Éruption cutanée",
            reponse2: "Frissons",
            reponse3: "Fièvre",
            reponse4: "Mal de tête",
            bonne_reponse: 1,
            theme_id: 1
        },
        {
            question: "Combien fait 2+2 ?",
            reponse1: "4",
            reponse2: "3",
            reponse3: "2",
            reponse4: "1",
            bonne_reponse: 1,
            theme_id: 2
        },
        {
            question: "Quelle est la racine carrée de 144 ?",
            reponse1: "12",
            reponse2: "14",
            reponse3: "10",
            reponse4: "16",
            bonne_reponse: 1,
            theme_id: 2
        },
        {
            question: "Quel est le PGCD de 24 et 36 ?",
            reponse1: "6",
            reponse2: "12",
            reponse3: "8",
            reponse4: "4",
            bonne_reponse: 2,
            theme_id: 2
        },
        {
            question: "Résoudre : 2x + 5 = 13",
            reponse1: "x = 3",
            reponse2: "x = 4",
            reponse3: "x = 5",
            reponse4: "x = 6",
            bonne_reponse: 2,
            theme_id: 2
        },
        {
            question: "Quelle est la valeur de π (pi) arrondie à 2 décimales ?",
            reponse1: "3.14",
            reponse2: "3.16",
            reponse3: "3.12",
            reponse4: "3.18",
            bonne_reponse: 1,
            theme_id: 2
        },
        {
            question: "Factoriser : x² - 4",
            reponse1: "(x+2)(x-2)",
            reponse2: "(x+4)(x-1)",
            reponse3: "(x+1)(x-4)",
            reponse4: "(x+3)(x-1)",
            bonne_reponse: 1,
            theme_id: 2
        },
        {
            question: "Quelle est la dérivée de x² ?",
            reponse1: "2x",
            reponse2: "x",
            reponse3: "2",
            reponse4: "x²",
            bonne_reponse: 1,
            theme_id: 2
        },
        {
            question: "Combien font 60 ÷ 3 ?",
            reponse1: "15",
            reponse2: "20",
            reponse3: "25",
            reponse4: "30",
            bonne_reponse: 2,
            theme_id: 2
        },
        {
            question: "Convertir 25% en fraction irréductible",
            reponse1: "1/4",
            reponse2: "2/8",
            reponse3: "3/12",
            reponse4: "5/20",
            bonne_reponse: 1,
            theme_id: 2
        },
        {
            question: "Combien font 12 x 12 ?",
            reponse1: "144",
            reponse2: "124",
            reponse3: "134",
            reponse4: "154",
            bonne_reponse: 1,
            theme_id: 2
        },
        {
            question: "Quelle est la somme des angles d'un triangle ?",
            reponse1: "90°",
            reponse2: "180°",
            reponse3: "270°",
            reponse4: "360°",
            bonne_reponse: 2,
            theme_id: 2
        },
        {
            question: "Quelle est la formule de l'eau ?",
            reponse1: "H2O",
            reponse2: "CO2",
            reponse3: "NaCl",
            reponse4: "CH4",
            bonne_reponse: 1,
            theme_id: 3
        },
        {
            question: "Quelle planète est la plus proche du soleil ?",
            reponse1: "Venus",
            reponse2: "Mars",
            reponse3: "Mercure",
            reponse4: "Jupiter",
            bonne_reponse: 3,
            theme_id: 3
        },        {
            question: "Quel est l'os le plus long du corps humain ?",
            reponse1: "Le fémur",
            reponse2: "L'humérus",
            reponse3: "Le tibia",
            reponse4: "Le péroné",
            bonne_reponse: 1,
            theme_id: 3
        },
        {
            question: "Quelle est la plus grande planète du système solaire ?",
            reponse1: "Mars",
            reponse2: "Saturne",
            reponse3: "Jupiter",
            reponse4: "Neptune",
            bonne_reponse: 3,
            theme_id: 3
        },
        {
            question: "De quoi se nourrit principalement un panda ?",
            reponse1: "Bambou",
            reponse2: "Eucalyptus",
            reponse3: "Herbe",
            reponse4: "Fruits",
            bonne_reponse: 1,
            theme_id: 3
        },
        {
            question: "Quel est le plus grand océan du monde ?",
            reponse1: "Atlantique",
            reponse2: "Indien",
            reponse3: "Pacifique",
            reponse4: "Arctique",
            bonne_reponse: 3,
            theme_id: 3
        },
        {
            question: "Quel est le symbole chimique de l'or ?",
            reponse1: "Ag",
            reponse2: "Au",
            reponse3: "Cu",
            reponse4: "Fe",
            bonne_reponse: 2,
            theme_id: 3
        },
        {
            question: "Quelle est la vitesse de la lumière ?",
            reponse1: "299 792 km/s",
            reponse2: "199 792 km/s",
            reponse3: "399 792 km/s",
            reponse4: "499 792 km/s",
            bonne_reponse: 1,
            theme_id: 3
        },
        {
            question: "Quel est l'élément le plus abondant dans l'Univers ?",
            reponse1: "Oxygène",
            reponse2: "Carbone",
            reponse3: "Hydrogène",
            reponse4: "Hélium",
            bonne_reponse: 3,
            theme_id: 3
        },
        {
            question: "Combien de planètes y a-t-il dans notre système solaire ?",
            reponse1: "7",
            reponse2: "8",
            reponse3: "9",
            reponse4: "10",
            bonne_reponse: 2,
            theme_id: 3
        },
        {
            question: "Que signifie HTML ?",
            reponse1: "HyperText Markup Language",
            reponse2: "High Tech Modern Language",
            reponse3: "Home Tool Markup Language",
            reponse4: "Hyper Text Multiple Language",
            bonne_reponse: 1,
            theme_id: 4
        },
        {
            question: "Quel est le langage de programmation le plus utilisé pour le web ?",
            reponse1: "Python",
            reponse2: "Java",
            reponse3: "JavaScript",
            reponse4: "C++",
            bonne_reponse: 3,
            theme_id: 4
        },
        {
            question: "Que signifie USB ?",
            reponse1: "Universal Serial Bus",
            reponse2: "United Serial Box",
            reponse3: "Universal System Base",
            reponse4: "United System Bus",
            bonne_reponse: 1,
            theme_id: 4
        },
        {
            question: "Qu'est-ce qu'une adresse IP ?",
            reponse1: "Un identifiant unique d'appareil",
            reponse2: "Un nom de domaine",
            reponse3: "Un mot de passe",
            reponse4: "Un type de fichier",
            bonne_reponse: 1,
            theme_id: 4
        },
        {
            question: "Que signifie WWW ?",
            reponse1: "World Wide Web",
            reponse2: "Web World Wide",
            reponse3: "World Web Wide",
            reponse4: "Wide World Web",
            bonne_reponse: 1,
            theme_id: 4
        },
        {
            question: "Que signifie CPU ?",
            reponse1: "Central Processing Unit",
            reponse2: "Computer Personal Unit",
            reponse3: "Control Processing Unit",
            reponse4: "Central Program Unit",
            bonne_reponse: 1,
            theme_id: 4
        },
        {
            question: "Quelle unité mesure la vitesse du processeur ?",
            reponse1: "Byte",
            reponse2: "Hertz",
            reponse3: "Watt",
            reponse4: "Volt",
            bonne_reponse: 2,
            theme_id: 4
        },
        {
            question: "Quelle est la différence entre HTTP et HTTPS ?",
            reponse1: "La vitesse",
            reponse2: "Le chiffrement",
            reponse3: "La taille des données",
            reponse4: "Le type de contenu",
            bonne_reponse: 2,
            theme_id: 4
        },
        {
            question: "Que signifie RAM ?",
            reponse1: "Random Access Memory",
            reponse2: "Read Access Memory",
            reponse3: "Real Access Memory",
            reponse4: "Rapid Access Memory",
            bonne_reponse: 1,
            theme_id: 4
        },
        {
            question: "Quel protocole est utilisé pour sécuriser les connexions web (HTTPS) ?",
            reponse1: "SSH",
            reponse2: "SSL/TLS",
            reponse3: "FTP",
            reponse4: "SMTP",
            bonne_reponse: 2,
            theme_id: 4
        }
        ]);
    });
};
