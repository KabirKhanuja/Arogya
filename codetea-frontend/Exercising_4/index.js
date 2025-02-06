import React from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, } from "react-native";
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
				<View 
					style={{
						backgroundColor: "#F9F4EF",
						paddingTop: 42,
					}}>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 18,
							marginBottom: 320,
							marginLeft: 31,
						}}>
						{"Improve your balance "}
					</Text>
					<Text 
						style={{
							color: "#F99E16",
							fontSize: 128,
							textAlign: "center",
							marginBottom: 252,
						}}>
						{"1"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 16,
							marginHorizontal: 16,
						}}>
						<TouchableOpacity 
							style={{
								width: 167,
								alignItems: "center",
								backgroundColor: "#F4EADB",
								borderRadius: 8,
								paddingVertical: 18,
							}} onPress={()=>alert('Pressed!')}>
							<Text 
								style={{
									color: "#21160A",
									fontSize: 16,
								}}>
								{"Alternate"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={{
								width: 160,
								alignItems: "center",
								backgroundColor: "#F4EADB",
								borderRadius: 8,
								paddingVertical: 18,
							}} onPress={()=>alert('Pressed!')}>
							<Text 
								style={{
									color: "#21160A",
									fontSize: 16,
								}}>
								{"Next"}
							</Text>
						</TouchableOpacity>
					</View>
					<View 
						style={{
							height: 20,
							backgroundColor: "#F9F4EF",
						}}>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}