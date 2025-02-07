import React from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, } from "react-native";

export default function ProfileScreen() {
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
						backgroundColor: "#FCF9F7",
					}}>
					<View 
						style={{
							alignItems: "center",
							backgroundColor: "#FCF9F7",
							paddingTop: 20,
							paddingBottom: 9,
							marginBottom: 16,
						}}>
						<Text 
							style={{
								color: "#1C160C",
								fontSize: 18,
							}}>
							{"Badges & Certificates"}
						</Text>
					</View>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={{
							borderRadius: 64,
							height: 128,
							marginBottom: 19,
							marginHorizontal: 131,
						}}
					/>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 22,
							textAlign: "center",
							marginBottom: 20,
						}}>
						{"Viru"}
					</Text>
					<Text 
						style={{
							color: "#9E7A47",
							fontSize: 16,
							textAlign: "center",
							marginBottom: 20,
						}}>
						{"Age: 65, Weight: 89 kgs, Height: 6'1\""}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 24,
							marginHorizontal: 16,
						}}>
						<TouchableOpacity 
							style={{
								width: 173,
								alignItems: "center",
								backgroundColor: "#F4EFE5",
								borderRadius: 8,
								paddingVertical: 15,
							}} onPress={()=>alert('Pressed!')}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 14,
								}}>
								{"Re-evaluate"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={{
								width: 173,
								alignItems: "center",
								backgroundColor: "#F99E16",
								borderRadius: 8,
								paddingVertical: 15,
							}} onPress={()=>alert('Pressed!')}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 14,
								}}>
								{"Settings"}
							</Text>
						</TouchableOpacity>
					</View>
					<Text 
						style={{
							color: "#9E7A47",
							fontSize: 16,
							marginBottom: 19,
							marginLeft: 122,
						}}>
						{"Recovery Progress"}
					</Text>
					<View 
						style={{
							alignItems: "flex-start",
							backgroundColor: "#F5F0E5",
							borderRadius: 4,
							marginBottom: 29,
							marginHorizontal: 16,
						}}>
						<View 
							style={{
								width: 179,
								height: 8,
								backgroundColor: "#F99E16",
								borderRadius: 4,
							}}>
						</View>
					</View>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 18,
							marginBottom: 24,
							marginLeft: 17,
						}}>
						{"Badges"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 18,
							marginHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 173,
								height: 173,
							}}
						/>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 173,
								height: 173,
							}}
						/>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 7,
							marginLeft: 17,
							marginRight: 45,
						}}>
						<Text 
							style={{
								color: "#1C160C",
								fontSize: 16,
								marginRight: 4,
								flex: 1,
							}}>
							{"First Step Badge"}
						</Text>
						<Text 
							style={{
								color: "#1C160C",
								fontSize: 16,
							}}>
							{"Second Step Badge"}
						</Text>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 33,
							marginLeft: 16,
							marginRight: 68,
						}}>
						<Text 
							style={{
								color: "#9E7A47",
								fontSize: 14,
								marginRight: 4,
								flex: 1,
							}}>
							{"For completing 1st exercise"}
						</Text>
						<Text 
							style={{
								color: "#9E7A47",
								fontSize: 14,
								width: 121,
							}}>
							{"For completing 2nd exercise"}
						</Text>
					</View>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={{
							borderRadius: 8,
							width: 173,
							height: 173,
							marginBottom: 18,
							marginLeft: 16,
						}}
					/>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 16,
							marginBottom: 7,
							marginLeft: 17,
						}}>
						{"Five Steps Badge"}
					</Text>
					<Text 
						style={{
							color: "#9E7A47",
							fontSize: 14,
							marginBottom: 50,
							marginLeft: 16,
						}}>
						{"For completing 5 exercises"}
					</Text>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 18,
							marginBottom: 25,
							marginLeft: 16,
						}}>
						{"Certificates"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 18,
							marginHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 173,
								height: 173,
							}}
						/>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 173,
								height: 173,
							}}
						/>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "flex-start",
							marginBottom: 42,
							marginLeft: 16,
							marginRight: 55,
						}}>
						<View 
							style={{
								width: 171,
								marginRight: 14,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									textAlign: "center",
									marginBottom: 7,
								}}>
								{"Completion Certificate"}
							</Text>
							<Text 
								style={{
									color: "#9E7A47",
									fontSize: 14,
									width: 119,
								}}>
								{"For completing the program"}
							</Text>
						</View>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 15,
								}}>
								{"Goal Achievement Certificate"}
							</Text>
							<Text 
								style={{
									color: "#9E7A47",
									fontSize: 14,
								}}>
								{"For reaching goals"}
							</Text>
						</View>
					</View>
					<TouchableOpacity 
						style={{
							alignItems: "center",
							backgroundColor: "#F99E16",
							borderRadius: 8,
							paddingVertical: 15,
							marginBottom: 12,
							marginHorizontal: 16,
						}} onPress={()=>alert('Pressed!')}>
						<Text 
							style={{
								color: "#1C160C",
								fontSize: 14,
							}}>
							{"Share on social media"}
						</Text>
					</TouchableOpacity>
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
									color: "#9E7A47",
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
									color: "#1C160C",
									fontSize: 12,
								}}>
								{"Profile"}
							</Text>
						</View>
					</View>
					<View 
						style={{
							height: 20,
							backgroundColor: "#FCF9F7",
						}}>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}