import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../auth/AuthContext";
import { SafeAreaView, View, ScrollView, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { RoadmpaGenerationExtraProps } from "./GeneratingRoadmap";
import { MainStackNavigationProps } from "../routes/MainStack";
import UserProfiledb from "../utils/UserProfiledb";

export default function FormScreen() {
    const { authService, user, setUser } = useContext(AppContext);
    const [age, setAge] = useState('');
    const navigation = useNavigation<MainStackNavigationProps>();
    const [gender, setGender] = useState((user && user.gender != "") ? user.gender : "");
    const [height, setHeight] = useState((user && user.height != "") ? user.height : "");
    const [weight, setWeight] = useState((user && user.weight != "") ? user.weight : "");
    const [smoking, setSmoking] = useState("");
    const [drinking, setDrinking] = useState("");
    const [problems, setProblems] = useState("");
    const [medicalHistory, setMedicalHistory] = useState("");
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [showSmokingModal, setShowSmokingModal] = useState(false);
    const [showDrinkingModal, setShowDrinkingModal] = useState(false);
    const genderOptions = ['Male', 'Female', 'Other'];
    const yesNoOptions = ['Never', 'Sometimes', 'Frequently'];
    const forceGenerate = (useRoute().params as RoadmpaGenerationExtraProps)?.force || false;

    useEffect(() => {
        console.log(user);
        
        if (user) {
            if (user.age) setAge(user.age.toString());
            if (user.gender) setGender(user.gender);
            if (user.height) setHeight(user.height.toString());
            if (user.weight) setWeight(user.weight.toString());
            if (user.doYouSmoke) setSmoking(user.doYouSmoke);
            if (user.doYouDrink) setDrinking(user.doYouDrink);
            if (user.problems) setProblems(user.problems.toString());
            if (user.medicalHistory) setMedicalHistory(user.medicalHistory);
        }
    }, []);

    const handleBack = () => {
        navigation.navigate("MainTabs");
    };

    const handleNumberInput = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, min: number, max: number) => {
        let numericValue = text.replace(/[^0-9]/g, '');
        if (numericValue !== '') {
            numericValue = Math.max(min, Math.min(max, parseInt(numericValue))).toString();
        }
        setter(numericValue);
    };

    const handleContinue = () => {

        if (!age || !gender || !height || !weight || !smoking || !drinking || !problems || !medicalHistory) {
            alert("Please fill out all fields before continuing.");
            return;
        }

        authService.updateUserAccount({
            age: parseInt(age),
            gender: gender,
            weight: weight,
            height: height,
            doYouSmoke: smoking,
            doYouDrink: drinking,
            problems: problems,
            medicalHistory: medicalHistory
        })
            .then(responseJson => {
                if (responseJson) {
                    const updatedUser = {
                        ...user!!,
                        age: parseInt(age),
                        gender: gender,
                        weight: weight,
                        height: height,
                        doYouSmoke: smoking,
                        doYouDrink: drinking,
                        problems: problems,
                        medicalHistory: medicalHistory,
                        formFilled: true
                    }
                    setUser(updatedUser);
                    UserProfiledb.setProfile(updatedUser);

                    console.log("User account updated successfully", responseJson);
                    navigation.navigate("GeneratingRoadmap",{
                        force: forceGenerate
                    });
                    return;
                }
                console.log("Error updating user account");
            })
            .catch(err => {
                console.log("Error updating user account");
                // TODO: Show error message
            });
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                }}>
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        paddingBottom: 43,
                        marginBottom: 12,
                    }}>
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: 16,
                            marginBottom: 26,
                            marginTop: 18,
                        }}>
                        <TouchableOpacity onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color={"black"} />
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 22,
                            textAlign: "center",
                            marginBottom: 22,
                        }}>
                        {"Let's get started!"}
                    </Text>
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 16,
                            marginBottom: 40,
                            marginHorizontal: 28,
                            textAlign: "center",
                        }}>
                        {"We will use this information to customize your program and track your progress."}
                    </Text>
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 16,
                            marginBottom: 10,
                            marginLeft: 18,
                        }}>
                        {"Name"}
                    </Text>
                    <TextInput
                        placeholder={""}
                        value={user ? user?.name : "Not added"}
                        editable={false}
                        style={{
                            color: "#8C7A5E",
                            fontSize: 16,
                            marginBottom: 32,
                            marginHorizontal: 16,
                            backgroundColor: "#F4F2EF",
                            borderRadius: 12,
                            paddingVertical: 22,
                            paddingHorizontal: 18,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                            marginLeft: 18,
                            marginRight: 145,
                        }}>
                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Age"}
                        </Text>
                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 16,
                            }}>
                            {"Gender"}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 30,
                            marginHorizontal: 16,
                            gap: 16,
                        }}>
                        <TextInput
                            style={{
                                flex: 1,
                                height: 56,
                                backgroundColor: "#F4F2EF",
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                fontSize: 16,
                            }}
                            placeholder="Age"
                            value={age}
                            onChangeText={(text) => handleNumberInput(text, setAge, 1, 150)}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 56,
                                backgroundColor: "#F4F2EF",
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                justifyContent: "center",
                            }}
                            onPress={() => setShowGenderModal(true)}
                        >
                            <Text style={{ fontSize: 16, color: gender ? "#161411" : "#8C7A5E" }}>
                                {gender || "Gender"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                            marginLeft: 18,
                            marginRight: 98,
                        }}>
                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 16,
                                marginRight: 4,
                                flex: 1,
                            }}>
                            {"Height (in cm)"}
                        </Text>
                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 16,
                            }}>
                            {"Weight (in kg)"}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                            marginHorizontal: 16,
                            gap: 16,
                        }}>
                        <TextInput
                            style={{
                                flex: 1,
                                height: 56,
                                backgroundColor: "#F4F2EF",
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                fontSize: 16,
                            }}
                            placeholder="Height (cm)"
                            value={height}
                            onChangeText={(text) => handleNumberInput(text, setHeight, 1, 300)}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                height: 56,
                                backgroundColor: "#F4F2EF",
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                fontSize: 16,
                            }}
                            placeholder="Weight (kg)"
                            value={weight}
                            onChangeText={(text) => handleNumberInput(text, setWeight, 1, 500)}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                    </View>
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            paddingTop: 17,
                            paddingBottom: 40,
                            paddingHorizontal: 16,
                            marginBottom: 15,
                        }}>
                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 16,
                                marginBottom: 22,
                            }}>
                            {"Do you smoke?"}
                        </Text>
                        <TouchableOpacity
                            style={{
                                height: 56,
                                backgroundColor: "#F4F2EF",
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                justifyContent: "center",
                                marginBottom: 35,
                            }}
                            onPress={() => setShowSmokingModal(true)}
                        >
                            <Text style={{ fontSize: 16, color: smoking ? "#161411" : "#8C7A5E" }}>
                                {smoking || "Select option"}
                            </Text>
                        </TouchableOpacity>

                        <Text
                            style={{
                                color: "#161411",
                                fontSize: 16,
                                marginBottom: 21,
                            }}>
                            {"Do you drink?"}
                        </Text>
                        <TouchableOpacity
                            style={{
                                height: 56,
                                backgroundColor: "#F4F2EF",
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                justifyContent: "center",
                            }}
                            onPress={() => setShowDrinkingModal(true)}
                        >
                            <Text style={{ fontSize: 16, color: drinking ? "#161411" : "#8C7A5E" }}>
                                {drinking != "" ? drinking : "Select option"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 16,
                            marginBottom: 10,
                            marginLeft: 20,
                        }}>
                        {"What problems are you facing?"}
                    </Text>
                    <TextInput
                        placeholder="Reason you need rehab..."
                        value={problems}
                        onChangeText={setProblems}
                        multiline={true}
                        style={{
                            color: "#8C7A5E",
                            fontSize: 16,
                            marginBottom: 32,
                            marginHorizontal: 16,
                            backgroundColor: "#F4F2EF",
                            borderRadius: 12,
                            paddingVertical: 22,
                            paddingHorizontal: 18,
                            height: 120,
                            textAlignVertical: 'top'
                        }}
                    />
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 16,
                            marginBottom: 10,
                            marginLeft: 20,
                        }}>
                        {"Medical history"}
                    </Text>
                    <TextInput
                        placeholder="Past injuries, medications, etc..."
                        value={medicalHistory}
                        onChangeText={setMedicalHistory}
                        multiline={true}
                        style={{
                            color: "#8C7A5E",
                            fontSize: 16,
                            marginBottom: 16, // reduced from 32
                            marginHorizontal: 16,
                            backgroundColor: "#F4F2EF",
                            borderRadius: 12,
                            paddingVertical: 22,
                            paddingHorizontal: 18,
                            height: 120,
                            textAlignVertical: 'top'
                        }}
                    />
                    <View
                        style={{
                            height: 10, // reduced from 20
                            backgroundColor: "#FFFFFF",
                        }}>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        alignItems: "center",
                        backgroundColor: "#F99E16",
                        borderRadius: 12,
                        paddingVertical: 15,
                        marginBottom: 10,
                        marginHorizontal: 16,
                    }} onPress={handleContinue}>
                    <Text
                        style={{
                            color: "#161411",
                            fontSize: 14,
                        }}>
                        {"Continue"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <Modal
                visible={showGenderModal}
                transparent={true}
                animationType="slide"
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 16,
                    }}>
                        {genderOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={{
                                    paddingVertical: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F4F2EF'
                                }}
                                onPress={() => {
                                    setGender(option);
                                    setShowGenderModal(false);
                                }}
                            >
                                <Text style={{ fontSize: 16, color: '#161411' }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={{
                                paddingVertical: 16,
                                alignItems: 'center'
                            }}
                            onPress={() => setShowGenderModal(false)}
                        >
                            <Text style={{ fontSize: 16, color: '#F99E16' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showSmokingModal}
                transparent={true}
                animationType="slide"
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 16,
                    }}>
                        {yesNoOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={{
                                    paddingVertical: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F4F2EF'
                                }}
                                onPress={() => {
                                    setSmoking(option);
                                    setShowSmokingModal(false);
                                }}
                            >
                                <Text style={{ fontSize: 16, color: '#161411' }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={{
                                paddingVertical: 16,
                                alignItems: 'center'
                            }}
                            onPress={() => setShowSmokingModal(false)}
                        >
                            <Text style={{ fontSize: 16, color: '#F99E16' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showDrinkingModal}
                transparent={true}
                animationType="slide"
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 16,
                    }}>
                        {yesNoOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={{
                                    paddingVertical: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F4F2EF'
                                }}
                                onPress={() => {
                                    setDrinking(option);
                                    setShowDrinkingModal(false);
                                }}
                            >
                                <Text style={{ fontSize: 16, color: '#161411' }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={{
                                paddingVertical: 16,
                                alignItems: 'center'
                            }}
                            onPress={() => setShowDrinkingModal(false)}
                        >
                            <Text style={{ fontSize: 16, color: '#F99E16' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}