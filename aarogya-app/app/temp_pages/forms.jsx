import React, {useState} from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TextInput, TouchableOpacity, } from "react-native";
export default (props) => {
	const [textInput1, onChangeTextInput1] = useState('');
	const [textInput2, onChangeTextInput2] = useState('');
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
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 24,
								height: 24,
								marginTop: 28,
							}}
						/>
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
						placeholder={"First  Name"}
						value={textInput1}
						onChangeText={onChangeTextInput1}
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
					<TextInput
						placeholder={"Last  Name"}
						value={textInput2}
						onChangeText={onChangeTextInput2}
						style={{
							color: "#8C7A5E",
							fontSize: 16,
							marginBottom: 30,
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
							marginLeft: 17,
							marginRight: 125,
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
							alignItems: "center",
							marginBottom: 30,
							marginHorizontal: 16,
						}}>
						<View 
							style={{
								width: 120,
								height: 56,
								backgroundColor: "#F4F2EF",
							}}>
						</View>
						<View 
							style={{
								width: 40,
								backgroundColor: "#F4F2EF",
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginTop: 16,
								}}
							/>
						</View>
						<View 
							style={{
								flex: 1,
								alignSelf: "stretch",
							}}>
						</View>
						<View 
							style={{
								width: 120,
								height: 56,
								backgroundColor: "#F4F2EF",
							}}>
						</View>
						<View 
							style={{
								width: 40,
								backgroundColor: "#F4F2EF",
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginTop: 16,
								}}
							/>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 10,
							marginLeft: 18,
							marginRight: 127,
						}}>
						<Text 
							style={{
								color: "#161411",
								fontSize: 16,
								marginRight: 4,
								flex: 1,
							}}>
							{"Height"}
						</Text>
						<Text 
							style={{
								color: "#161411",
								fontSize: 16,
							}}>
							{"Weight"}
						</Text>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 12,
							marginHorizontal: 16,
						}}>
						<View 
							style={{
								width: 120,
								height: 56,
								backgroundColor: "#F4F2EF",
							}}>
						</View>
						<View 
							style={{
								width: 40,
								height: 56,
								backgroundColor: "#F4F2EF",
							}}>
						</View>
						<View 
							style={{
								flex: 1,
								alignSelf: "stretch",
							}}>
						</View>
						<View 
							style={{
								width: 120,
								height: 56,
								backgroundColor: "#F4F2EF",
							}}>
						</View>
						<View 
							style={{
								width: 40,
								height: 56,
								backgroundColor: "#F4F2EF",
							}}>
						</View>
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
							{"Do you smoke? "}
						</Text>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 35,
							}}>
							<View 
								style={{
									width: 297,
									height: 56,
									backgroundColor: "#F4F2EF",
								}}>
							</View>
							<View 
								style={{
									width: 40,
									backgroundColor: "#F4F2EF",
								}}>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 24,
										height: 24,
										marginTop: 16,
									}}
								/>
							</View>
						</View>
						<Text 
							style={{
								color: "#161411",
								fontSize: 16,
								marginBottom: 21,
							}}>
							{"Do you drink? "}
						</Text>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}>
							<View 
								style={{
									width: 297,
									height: 56,
									backgroundColor: "#F4F2EF",
								}}>
							</View>
							<View 
								style={{
									width: 40,
									backgroundColor: "#F4F2EF",
								}}>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 24,
										height: 24,
										marginTop: 16,
									}}
								/>
							</View>
						</View>
					</View>
					<Text 
						style={{
							color: "#161411",
							fontSize: 16,
							marginBottom: 54,
							marginLeft: 20,
						}}>
						{"What problems are you facing?"}
					</Text>
					<Text 
						style={{
							color: "#8C7A5E",
							fontSize: 16,
							marginBottom: 162,
							marginLeft: 37,
						}}>
						{"Reason you need rehab..."}
					</Text>
					<Text 
						style={{
							color: "#161411",
							fontSize: 16,
							marginBottom: 52,
							marginLeft: 30,
						}}>
						{"   Medical history"}
					</Text>
					<Text 
						style={{
							color: "#8C7A5E",
							fontSize: 16,
							marginBottom: 97,
							marginLeft: 40,
						}}>
						{"Past injuries, medications, etc..."}
					</Text>
					<View 
						style={{
							height: 20,
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
						marginHorizontal: 16,
					}} onPress={()=>alert('Pressed!')}>
					<Text 
						style={{
							color: "#161411",
							fontSize: 14,
						}}>
						{"Continue"}
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	)
}