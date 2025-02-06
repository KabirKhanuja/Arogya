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
					backgroundColor: "#FCFAF7",
				}}>
				<View 
					style={{
						alignItems: "flex-start",
						backgroundColor: "#FCFAF7",
					}}>
					<View 
						style={{
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingTop: 21,
							paddingBottom: 8,
							marginBottom: 16,
						}}>
						<Text 
							style={{
								color: "#161411",
								fontSize: 18,
							}}>
							{"Dashboard"}
						</Text>
					</View>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={{
							borderRadius: 64,
							width: 128,
							height: 128,
							marginBottom: 21,
							marginLeft: 126,
						}}
					/>
					<Text 
						style={{
							color: "#161411",
							fontSize: 22,
							marginBottom: 7,
							marginLeft: 81,
						}}>
						{"Good morning, Viru!"}
					</Text>
					<Text 
						style={{
							color: "#8C7A5E",
							fontSize: 16,
							marginBottom: 34,
							marginLeft: 82,
						}}>
						{"Ready for today's exercises?"}
					</Text>
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
								backgroundColor: "#F4F2EF",
								borderRadius: 12,
								paddingVertical: 30,
								paddingHorizontal: 25,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									marginBottom: 16,
								}}>
								{"Steps Today"}
							</Text>
							<Text 
								style={{
									color: "#161411",
									fontSize: 24,
								}}>
								{"45"}
							</Text>
						</View>
						<View 
							style={{
								width: 171,
								backgroundColor: "#F4F2EF",
								borderRadius: 12,
								paddingVertical: 30,
								paddingHorizontal: 26,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									marginBottom: 16,
								}}>
								{"Exercises done "}
							</Text>
							<Text 
								style={{
									color: "#161411",
									fontSize: 24,
								}}>
								{"2"}
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
								backgroundColor: "#F4F2EF",
								borderRadius: 12,
								paddingVertical: 30,
								paddingHorizontal: 25,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									marginBottom: 16,
								}}>
								{"Time spent"}
							</Text>
							<Text 
								style={{
									color: "#161411",
									fontSize: 24,
								}}>
								{"1:03"}
							</Text>
						</View>
						<View 
							style={{
								width: 171,
								backgroundColor: "#F4F2EF",
								borderRadius: 12,
								paddingVertical: 30,
								paddingHorizontal: 25,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									marginBottom: 16,
								}}>
								{"Calories burned"}
							</Text>
							<Text 
								style={{
									color: "#161411",
									fontSize: 24,
								}}>
								{"34"}
							</Text>
						</View>
					</View>
					<View 
						style={{
							backgroundColor: "#F4F2EF",
							borderRadius: 12,
							paddingVertical: 30,
							paddingHorizontal: 25,
							marginBottom: 37,
							marginHorizontal: 16,
						}}>
						<Text 
							style={{
								color: "#161411",
								fontSize: 16,
								marginBottom: 16,
							}}>
							{"Total score"}
						</Text>
						<Text 
							style={{
								color: "#161411",
								fontSize: 24,
							}}>
							{"3,456"}
						</Text>
					</View>
					<Text 
						style={{
							color: "#161411",
							fontSize: 18,
							marginBottom: 26,
							marginLeft: 17,
						}}>
						{"Today's roadmap"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "flex-start",
							marginBottom: 2,
							marginLeft: 32,
							marginRight: 206,
						}}>
						<View 
							style={{
								width: 8,
								marginTop: 2,
								marginRight: 25,
							}}>
							<View 
								style={{
									height: 8,
									backgroundColor: "#161411",
									borderRadius: 4,
									marginBottom: 4,
								}}>
							</View>
							<View 
								style={{
									height: 40,
									backgroundColor: "#E5E2DB",
									marginHorizontal: 3,
								}}>
							</View>
						</View>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									textAlign: "center",
									marginBottom: 8,
								}}>
								{"Morning routine"}
							</Text>
							<Text 
								style={{
									color: "#8C7A5E",
									fontSize: 16,
								}}>
								{"2 exercises"}
							</Text>
						</View>
					</View>
					<View 
						style={{
							width: 2,
							height: 16,
							backgroundColor: "#E5E2DB",
							marginBottom: 2,
							marginLeft: 35,
						}}>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "flex-start",
							marginBottom: 3,
							marginLeft: 32,
							marginRight: 213,
						}}>
						<View 
							style={{
								width: 8,
								marginTop: 2,
								marginRight: 25,
							}}>
							<View 
								style={{
									height: 8,
									backgroundColor: "#161411",
									borderRadius: 4,
									marginBottom: 4,
								}}>
							</View>
							<View 
								style={{
									height: 40,
									backgroundColor: "#E5E2DB",
									marginHorizontal: 3,
								}}>
							</View>
						</View>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#161411",
									fontSize: 16,
									textAlign: "center",
									marginBottom: 8,
								}}>
								{"Afternoon walk"}
							</Text>
							<Text 
								style={{
									color: "#8C7A5E",
									fontSize: 16,
									textAlign: "center",
								}}>
								{"Walk 500 steps"}
							</Text>
						</View>
					</View>
					<View 
						style={{
							width: 2,
							height: 16,
							backgroundColor: "#E5E2DB",
							marginBottom: 2,
							marginLeft: 35,
						}}>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 8,
							marginLeft: 32,
							marginRight: 209,
						}}>
						<View 
							style={{
								width: 8,
								height: 8,
								backgroundColor: "#161411",
								borderRadius: 4,
								marginRight: 26,
							}}>
						</View>
						<Text 
							style={{
								color: "#161411",
								fontSize: 16,
								flex: 1,
							}}>
							{"Evening routine"}
						</Text>
					</View>
					<Text 
						style={{
							color: "#8C7A5E",
							fontSize: 16,
							marginBottom: 21,
							marginLeft: 65,
						}}>
						{"3 exercises"}
					</Text>
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
							{"Start routine"}
						</Text>
					</TouchableOpacity>
					<View 
						style={{
							height: 20,
							backgroundColor: "#FFFFFF",
						}}>
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
									color: "#1C170D",
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
									color: "#9E7A47",
									fontSize: 12,
								}}>
								{"Profile"}
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}