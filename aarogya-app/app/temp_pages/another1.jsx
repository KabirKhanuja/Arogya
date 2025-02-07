import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity, } from "react-native";
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
						backgroundColor: "#FFFFFF",
					}}>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FFFFFF",
							paddingVertical: 28,
							paddingHorizontal: 16,
							marginBottom: 20,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 24,
								height: 24,
								marginRight: 56,
							}}
						/>
						<Text 
							style={{
								color: "#161411",
								fontSize: 18,
								flex: 1,
							}}>
							{"Can't do this exercise?"}
						</Text>
					</View>
					<Text 
						style={{
							color: "#161411",
							fontSize: 18,
							marginBottom: 9,
							marginLeft: 16,
						}}>
						{"Choose an alternate exercise"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FFFFFF",
							paddingVertical: 19,
							paddingHorizontal: 16,
						}}>
						<View 
							style={{
								flex: 1,
								marginRight: 4,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									marginBottom: 8,
									marginLeft: 1,
								}}>
								{"Exercise"}
							</Text>
							<Text 
								style={{
									color: "#8C7A5E",
									fontSize: 14,
									textAlign: "center",
								}}>
								{"Sitting leg lifts"}
							</Text>
						</View>
						<View 
							style={{
								width: 20,
								height: 20,
								borderColor: "#E5E2DB",
								borderRadius: 4,
								borderWidth: 2,
							}}>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FFFFFF",
							paddingVertical: 19,
							paddingHorizontal: 16,
						}}>
						<View 
							style={{
								flex: 1,
								marginRight: 4,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									marginBottom: 8,
									marginLeft: 1,
								}}>
								{"Exercise"}
							</Text>
							<Text 
								style={{
									color: "#8C7A5E",
									fontSize: 14,
									textAlign: "center",
								}}>
								{"Knee extension"}
							</Text>
						</View>
						<View 
							style={{
								width: 20,
								height: 20,
								borderColor: "#E5E2DB",
								borderRadius: 4,
								borderWidth: 2,
							}}>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FFFFFF",
							paddingVertical: 19,
							paddingHorizontal: 16,
							marginBottom: 429,
						}}>
						<View 
							style={{
								flex: 1,
								marginRight: 4,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									marginBottom: 8,
									marginLeft: 1,
								}}>
								{"Exercise"}
							</Text>
							<Text 
								style={{
									color: "#8C7A5E",
									fontSize: 14,
									textAlign: "center",
								}}>
								{"Standing leg lifts"}
							</Text>
						</View>
						<View 
							style={{
								width: 20,
								height: 20,
								borderColor: "#E5E2DB",
								borderRadius: 4,
								borderWidth: 2,
							}}>
						</View>
					</View>
					<TouchableOpacity 
						style={{
							alignItems: "center",
							backgroundColor: "#F99E16",
							borderRadius: 12,
							paddingVertical: 18,
							marginBottom: 12,
							marginHorizontal: 16,
						}} onPress={()=>alert('Pressed!')}>
						<Text 
							style={{
								color: "#161411",
								fontSize: 16,
							}}>
							{"Done"}
						</Text>
					</TouchableOpacity>
					<View 
						style={{
							height: 20,
							backgroundColor: "#FFFFFF",
						}}>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}