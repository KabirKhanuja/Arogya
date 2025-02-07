import React from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, } from "react-native";
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
						alignItems: "flex-start",
						backgroundColor: "#F9F4EF",
						paddingTop: 37,
					}}>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 18,
							marginBottom: 42,
							marginLeft: 17,
						}}>
						{"Improve your balance "}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 11,
							marginLeft: 17,
							marginRight: 30,
						}}>
						<Text 
							style={{
								color: "#21160A",
								fontSize: 16,
								marginRight: 4,
								flex: 1,
							}}>
							{"Stand up and breathe"}
						</Text>
						<Text 
							style={{
								color: "#21160A",
								fontSize: 16,
							}}>
							{"Counter: 7/10"}
						</Text>
					</View>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={{
							height: 463,
							marginBottom: 9,
						}}
					/>
					<View 
						style={{
							alignItems: "center",
							marginBottom: 27,
						}}>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}>
							<View 
								style={{
									width: 40,
									backgroundColor: "#F9F4EF",
									borderRadius: 20,
									paddingHorizontal: 10,
									marginRight: 24,
									shadowColor: "#0000001A",
									shadowOpacity: 0.1,
									shadowOffset: {
									    width: 0,
									    height: 2
									},
									shadowRadius: 4,
									elevation: 4,
								}}>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={{
										height: 20,
										marginTop: 10,
									}}
								/>
							</View>
							<View 
								style={{
									width: 64,
									backgroundColor: "#F9F4EF",
									borderRadius: 32,
									paddingHorizontal: 16,
									marginRight: 24,
									shadowColor: "#0000001A",
									shadowOpacity: 0.1,
									shadowOffset: {
									    width: 0,
									    height: 2
									},
									shadowRadius: 4,
									elevation: 4,
								}}>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={{
										height: 32,
										marginTop: 16,
									}}
								/>
							</View>
							<View 
								style={{
									width: 40,
									backgroundColor: "#F9F4EF",
									borderRadius: 20,
									paddingHorizontal: 10,
									shadowColor: "#0000001A",
									shadowOpacity: 0.1,
									shadowOffset: {
									    width: 0,
									    height: 2
									},
									shadowRadius: 4,
									elevation: 4,
								}}>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={{
										height: 20,
										marginTop: 10,
									}}
								/>
							</View>
						</View>
					</View>
					<TouchableOpacity 
						style={{
							backgroundColor: "#F99E16",
							borderRadius: 8,
							paddingVertical: 18,
							paddingHorizontal: 115,
							marginBottom: 25,
							marginLeft: 16,
						}} onPress={()=>alert('Pressed!')}>
						<Text 
							style={{
								color: "#21160A",
								fontSize: 16,
							}}>
							{"Exercise Demo"}
						</Text>
					</TouchableOpacity>
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