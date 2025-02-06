import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text, } from "react-native";
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
					backgroundColor: "#FCFAF7",
				}}>
				<View 
					style={{
						backgroundColor: "#FCFAF7",
						paddingBottom: 72,
					}}>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 28,
							paddingHorizontal: 16,
							marginBottom: 25,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 24,
								height: 24,
								marginRight: 25,
							}}
						/>
						<Text 
							style={{
								color: "#1C160C",
								fontSize: 18,
								flex: 1,
							}}>
							{"Challenges"}
						</Text>
					</View>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 22,
							marginBottom: 13,
							marginLeft: 18,
						}}>
						{"Morning"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 12,
							paddingHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 8,
								}}>
								{"Wake up your muscles"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
									textAlign: "center",
								}}>
								{"Start with a 5-minute stretching"}
							</Text>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
							marginBottom: 25,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
								}}>
								{"Strengthen your core"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Spend 15 minutes doing plank exercises."}
							</Text>
						</View>
					</View>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 22,
							marginBottom: 13,
							marginLeft: 17,
						}}>
						{"Afternoon"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
									marginLeft: 1,
								}}>
								{"Improve your balance"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Practice standing on one leg for 5 minutes."}
							</Text>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
							marginBottom: 25,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
									marginLeft: 1,
								}}>
								{"Increase your mobility"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Move your body in all directions to increase flexibility."}
							</Text>
						</View>
					</View>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 22,
							marginBottom: 13,
							marginLeft: 18,
						}}>
						{"Evening"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
									marginLeft: 1,
								}}>
								{"Relax your muscles"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Finish your day with a 10-minute massage."}
							</Text>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 12,
							paddingHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 8,
									marginLeft: 1,
								}}>
								{"Improve your posture"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
									textAlign: "center",
								}}>
								{"Sit straight and hold for 3 minutes."}
							</Text>
						</View>
					</View>
				</View>
				<View 
					style={{
						backgroundColor: "#FCF9F7",
						paddingVertical: 13,
						paddingHorizontal: 43,
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