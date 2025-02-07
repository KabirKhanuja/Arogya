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
				<View >
					<View 
						style={{
							alignItems: "flex-start",
							backgroundColor: "#FCF9F7",
						}}>
						<View 
							style={{
								alignItems: "center",
								backgroundColor: "#FCF9F7",
								paddingTop: 20,
								paddingBottom: 9,
								marginBottom: 12,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 18,
								}}>
								{"Summary"}
							</Text>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 4,
								marginLeft: 24,
								marginRight: 266,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginRight: 18,
								}}
							/>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									flex: 1,
								}}>
								{"Monday"}
							</Text>
						</View>
						<View 
							style={{
								width: 2,
								height: 16,
								backgroundColor: "#E8DDCE",
								marginBottom: 1,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								width: 2,
								height: 8,
								backgroundColor: "#E8DDCE",
								marginBottom: 4,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 4,
								marginLeft: 24,
								marginRight: 263,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginRight: 17,
								}}
							/>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									flex: 1,
								}}>
								{"Tuesday"}
							</Text>
						</View>
						<View 
							style={{
								width: 2,
								height: 16,
								backgroundColor: "#E8DDCE",
								marginBottom: 1,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								width: 2,
								height: 8,
								backgroundColor: "#E8DDCE",
								marginBottom: 4,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 4,
								marginLeft: 24,
								marginRight: 238,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginRight: 17,
								}}
							/>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									flex: 1,
								}}>
								{"Wednesday"}
							</Text>
						</View>
						<View 
							style={{
								width: 2,
								height: 16,
								backgroundColor: "#E8DDCE",
								marginBottom: 1,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								width: 2,
								height: 8,
								backgroundColor: "#E8DDCE",
								marginBottom: 4,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 4,
								marginLeft: 24,
								marginRight: 256,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginRight: 17,
								}}
							/>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									flex: 1,
								}}>
								{"Thursday"}
							</Text>
						</View>
						<View 
							style={{
								width: 2,
								height: 16,
								backgroundColor: "#E8DDCE",
								marginBottom: 1,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								width: 2,
								height: 8,
								backgroundColor: "#E8DDCE",
								marginBottom: 4,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 4,
								marginLeft: 24,
								marginRight: 281,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginRight: 18,
								}}
							/>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									flex: 1,
								}}>
								{"Friday"}
							</Text>
						</View>
						<View 
							style={{
								width: 2,
								height: 16,
								backgroundColor: "#E8DDCE",
								marginBottom: 1,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								width: 2,
								height: 8,
								backgroundColor: "#E8DDCE",
								marginBottom: 4,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 4,
								marginLeft: 24,
								marginRight: 258,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginRight: 17,
								}}
							/>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									flex: 1,
								}}>
								{"Saturday"}
							</Text>
						</View>
						<View 
							style={{
								width: 2,
								height: 16,
								backgroundColor: "#E8DDCE",
								marginBottom: 1,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								width: 2,
								height: 8,
								backgroundColor: "#E8DDCE",
								marginBottom: 4,
								marginLeft: 35,
							}}>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 30,
								marginLeft: 24,
								marginRight: 270,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 24,
									height: 24,
									marginRight: 17,
								}}
							/>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									flex: 1,
								}}>
								{"Sunday"}
							</Text>
						</View>
						<View 
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 16,
								marginHorizontal: 16,
							}}>
							<View 
								style={{
									width: 188,
									alignItems: "flex-start",
									paddingHorizontal: 1,
								}}>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 16,
										marginBottom: 9,
									}}>
									{"Today's Challenge"}
								</Text>
								<Text 
									style={{
										color: "#9E7A47",
										fontSize: 14,
										marginBottom: 18,
									}}>
									{"Complete 20 minutes of yoga"}
								</Text>
								<TouchableOpacity 
									style={{
										width: 98,
										height: 32,
										alignItems: "center",
										backgroundColor: "#F4EFE5",
										borderRadius: 8,
										paddingVertical: 11,
									}} onPress={()=>alert('Pressed!')}>
									<Text 
										style={{
											color: "#1C160C",
											fontSize: 14,
										}}>
										{"Start Now"}
									</Text>
								</TouchableOpacity>
							</View>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									borderRadius: 8,
									width: 130,
									height: 93,
								}}
							/>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "#FCF9F7",
								paddingVertical: 19,
								paddingHorizontal: 17,
								marginBottom: 16,
							}}>
							<View 
								style={{
									flex: 1,
									marginRight: 4,
								}}>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 16,
										textAlign: "center",
										marginBottom: 8,
									}}>
									{"Challenges"}
								</Text>
								<Text 
									style={{
										color: "#9E7A47",
										fontSize: 14,
										textAlign: "center",
									}}>
									{"15% complete"}
								</Text>
							</View>
							<View 
								style={{
									width: 88,
									alignItems: "flex-start",
									backgroundColor: "#E8DDCE",
									borderRadius: 2,
									marginRight: 13,
								}}>
								<View 
									style={{
										width: 15,
										height: 4,
										backgroundColor: "#F99E16",
										borderRadius: 2,
									}}>
								</View>
							</View>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 14,
								}}>
								{"15"}
							</Text>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 22,
								marginLeft: 16,
								marginRight: 42,
							}}>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									borderRadius: 8,
									width: 160,
									height: 213,
									marginRight: 12,
								}}
							/>
							<Image
								source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
								resizeMode = {"stretch"}
								style={{
									borderRadius: 8,
									width: 160,
									height: 213,
								}}
							/>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 34,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginRight: 27,
								}}>
								{"50 pushups in a day"}
							</Text>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
								}}>
								{"30 days of yoga"}
							</Text>
							<View 
								style={{
									flex: 1,
								}}>
							</View>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
								}}>
								{"100 squats challenge"}
							</Text>
						</View>
						<View 
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 16,
								marginHorizontal: 16,
							}}>
							<View 
								style={{
									width: 171,
									backgroundColor: "#F4EFE5",
									borderRadius: 8,
									paddingVertical: 30,
									paddingHorizontal: 25,
								}}>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 16,
										marginBottom: 16,
									}}>
									{"Steps"}
								</Text>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 24,
									}}>
									{"1,349"}
								</Text>
							</View>
							<View 
								style={{
									width: 171,
									backgroundColor: "#F4EFE5",
									borderRadius: 8,
									paddingVertical: 30,
									paddingHorizontal: 26,
								}}>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 16,
										marginBottom: 16,
									}}>
									{"Miles"}
								</Text>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 24,
									}}>
									{"0.5"}
								</Text>
							</View>
						</View>
						<View 
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 16,
								marginHorizontal: 16,
							}}>
							<View 
								style={{
									width: 171,
									backgroundColor: "#F4EFE5",
									borderRadius: 8,
									paddingVertical: 30,
									paddingHorizontal: 25,
								}}>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 16,
										marginBottom: 16,
									}}>
									{"Calories"}
								</Text>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 24,
									}}>
									{"78"}
								</Text>
							</View>
							<View 
								style={{
									width: 171,
									backgroundColor: "#F4EFE5",
									borderRadius: 8,
									paddingVertical: 30,
									paddingHorizontal: 25,
								}}>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 16,
										marginBottom: 16,
									}}>
									{"Active"}
								</Text>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 24,
									}}>
									{"31"}
								</Text>
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
										color: "#1C160C",
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
						<View 
							style={{
								height: 20,
								backgroundColor: "#FCF9F7",
							}}>
						</View>
					</View>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={{
							position: "absolute",
							bottom: 419,
							right: -130,
							borderRadius: 8,
							width: 160,
							height: 213,
						}}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}