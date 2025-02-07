import React from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, } from "react-native";
export default (props) => {
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
				<View >
					<View 
						style={{
							backgroundColor: "#FFFFFF",
							paddingTop: 48,
						}}>
						<Text 
							style={{
								color: "#1C160C",
								fontSize: 18,
								marginBottom: 586,
								marginLeft: 30,
							}}>
							{"Improve your balance "}
						</Text>
						<TouchableOpacity 
							style={{
								alignItems: "center",
								backgroundColor: "#F99E16",
								borderRadius: 8,
								paddingVertical: 18,
								marginBottom: 42,
								marginHorizontal: 22,
							}} onPress={()=>alert('Pressed!')}>
							<Text 
								style={{
									color: "#21160A",
									fontSize: 16,
								}}>
								{"Start Exercise"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={{
								alignItems: "center",
								backgroundColor: "#F99E16",
								borderRadius: 8,
								paddingVertical: 18,
								marginBottom: 34,
								marginHorizontal: 22,
							}} onPress={()=>alert('Pressed!')}>
							<Text 
								style={{
									color: "#21160A",
									fontSize: 16,
								}}>
								{"Go Back"}
							</Text>
						</TouchableOpacity>
						<View 
							style={{
								height: 20,
								backgroundColor: "#F9F4EF",
							}}>
						</View>
					</View>
					<View 
						style={{
							position: "absolute",
							top: 78,
							left: 84,
							width: 390,
							height: 531,
							backgroundColor: "#FFFFFF",
							paddingHorizontal: 25,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 175,
								height: 243,
								marginTop: 23,
							}}
						/>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 150,
								height: 248,
							}}
						/>
					</View>
				</View>
				<View 
					style={{
						backgroundColor: "#FCF9F7",
						paddingVertical: 13,
						paddingHorizontal: 42,
					}}>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 13,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 24,
								height: 24,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
						</View>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 24,
								height: 24,
								marginRight: 67,
							}}
						/>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 24,
								height: 24,
								marginRight: 68,
							}}
						/>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 24,
								height: 24,
							}}
						/>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}>
						<Text 
							style={{
								color: "#9E7A47",
								fontSize: 12,
								marginRight: 4,
								flex: 1,
							}}>
							{"Home"}
						</Text>
						<Text 
							style={{
								color: "#1C170D",
								fontSize: 12,
								marginRight: 59,
							}}>
							{"Fitness"}
						</Text>
						<Text 
							style={{
								color: "#9E7A47",
								fontSize: 12,
								marginRight: 61,
							}}>
							{"Chat"}
						</Text>
						<Text 
							style={{
								color: "#9E7A47",
								fontSize: 12,
							}}>
							{"Profile"}
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}