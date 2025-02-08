const USERS = [
    {
        "user": {
            "id": "67a7449ef8a87aa81f5b587f",
            "email": "sss@gmail.com",
            "name": "ssss",
            "age": "20",
            "height": "40",
            "weight": "40",
            "problems": "None",
            "doYouDrink": "Never",
            "doYouSmoke": "Never",
            "medicalHistory": "None",
            "formFilled": true
        },
        "user": {
            "id": "abcdef1234567890",
            "email": "rahul@gmail.com",
            "name": "Rahul Sharma",
            "age": "25",
            "height": "68",
            "weight": "160",
            "problems": "None",
            "doYouDrink": "No",
            "doYouSmoke": "No",
            "medicalHistory": "None",
            "formFilled": true
        }
    },
    {
        "user": {
            "id": "fedcba0987654321",
            "email": "priya@gmail.com",
            "name": "Priya Singh",
            "age": "28",
            "height": "65",
            "weight": "140",
            "problems": "None",
            "doYouDrink": "Occasionally",
            "doYouSmoke": "No",
            "medicalHistory": "None",
            "formFilled": true
        }
    },
    {
        "user": {
            "id": "1122334455667788",
            "email": "anil@gmail.com",
            "name": "Anil Kumar",
            "age": "35",
            "height": "72",
            "weight": "180",
            "problems": "Diabetes",
            "doYouDrink": "Yes",
            "doYouSmoke": "Yes",
            "medicalHistory": "Diabetes",
            "formFilled": true
        }
    }
]

export default function getUserMain(): UserType {
    return USERS[Math.floor(Math.random() * USERS.length)].user;
}