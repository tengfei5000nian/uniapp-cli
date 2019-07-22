<template>
	<view class="me-card" :class="{ disabled: disabled, show: show, destroy: destroy }" @tap="$emit('metap')">
		<view class="one init-seat" @transitionend="show ? $emit('show') : $emit('hide')" @animationend="$emit('destroy')">
			<view v-for="(item, index) in types" v-if="type === item" :key="index" class="front init-seat">
				<image class="top init-seat" :src="'https://cdn.feesource.xyz/bgzb/qyqx/card_' + type + '.png'"></image>
				<image class="bottom init-seat" :src="'https://cdn.feesource.xyz/bgzb/qyqx/card_' + type + '.png'"></image>
			</view>
			<image class="back init-seat" src="https://cdn.feesource.xyz/bgzb/qyqx/card.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'meCard',
		props: {
			type: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			},
			show: {
				type: Boolean,
				default: false
			},
			destroy: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				types: ['bb', 'bl', 'glyy', 'qpp', 'qx', 'tpp', 'wmn', 'xl']
			}
		}
	}
</script>

<style lang="scss" scoped>
	.me-card{
		position: relative;
		z-index: 0;
		width: 136upx;
		height: 199upx;
		perspective: 800upx;
		.init-seat{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.back, .front{
			backface-visibility: hidden;
		}
		.back{
			z-index: 1;
			transform: rotateY(180deg) translateZ(1px);
		}
		.one{
			transform-style: preserve-3d;
			transform: rotateY(180deg);
			transition: transform 1s;
		}
		&.disabled{
			z-index: 1;
			pointer-events: none;
			.one{
				transition: transform 1s;
			}
		}
		&.show{
			.one{
				transform: rotateY(0deg);
			}
		}
		&.destroy{
			.one{
				animation: cardDestroyOne 3s ease-in-out 0s forwards;
				@keyframes cardDestroyOne{
					0%{
						opacity: 1;
						transform: rotateZ(0deg) scale(1);
					}
					33%{
						opacity: 1;
						transform: rotateZ(30deg) scale(1.15);
					}
					66%{
						opacity: 1;
						transform: rotateZ(30deg) scale(1.15);
					}
					100%{
						opacity: 0;
						transform: rotateZ(30deg) scale(1.15);
					}
				}
			}
			.front{
				animation: cardDestroyFrontFalse 1s ease-in 1s forwards;
				@keyframes cardDestroyFrontFalse{
					0%, 50%, 100%{
						opacity: 1;
					}
					25%, 75%{
						opacity: .5;
					}
				}
			}
		}
		@supports (-webkit-mask-size: 100% 100%){
			& .top, & .bottom{
				-webkit-mask-position: center;
				-webkit-mask-repeat: no-repeat;
				-webkit-mask-size: 100% 100%;
			}
			& .top{
				-webkit-mask-image: url('data:image/png;base64,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UmVhZHlxyWU8AAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0QTFGMDc4ODgxRjMxMUU5QTIzQ0VDOTY4RjA2MzAxQiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0QTFGMDc4NzgxRjMxMUU5QTIzQ0VDOTY4RjA2MzAxQiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MDNDMzQxRDgxRTgxMUU5OTA5QUU3MzBERjVCNTdGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MDNDMzQxRTgxRTgxMUU5OTA5QUU3MzBERjVCNTdGNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppah2Y4AAATKSURBVHja7NprqGVjGMDxNe7ygdxqPqBMyX2KD0yh+ICQSxSFSLlMQyYJ5bikKGlScjdSSPlACDNmyrUx25hBkdxGyH1mziiiGLM9b/ud2u3O2WedfV17+/3qaTqz99rnnHX+Z613rX3mTNZq9QKmsZ1dgEAQCAJBIAgEgSAQBAICQSAIBIEgEASCQBAIAgGBIBAEgkAQCAJBIAgEgYBAEAgCQSAIBIEgEASCQEAgCASBIBAEgkAQCAJBICAQBIJAEAgCQSAIBIEgEBAIAkEgCASBIBAEgkAQCAgEgSAQBIJAEAgCQSAIBASCQBAIAkEgCASBIBAEAgJBIAgEgSAQBIJAEAgIBIEgEATCEKwWyHhZH7OkR6/1e8xFAhkPf8XcFnNEzC35425dHfO1QEbfCzGHxtyRw0jzdpev+WzMk9Ygo+2rmNNizon5puWxV7t43W9jFlqkjq4/YyZiDotZNs1zOg3k35hLYjYLZDQ9F3NIzJ0xf89wdFnfwevfHfOWy9zR83nMyTHnxXxXcptXZvk53o+5vfU/BVJtf8TcFHNkzMpZbrt8lp/nwph/Wh/Ywc+gstKVxPUx33e4/Zv5imbXEs9dHPPlVA84glTPpzEnxVzQRRxFjuP1kuuax6d7cJwDSYu4LSN2OklHjPkxb/ToNVfM8PgPMVe0e8K4BZJ+4x6OOTtmr5hjY9ZW/GuuxzwTc1DRuE3ey6jbLVS3xlwcMzlTIO+McBBb8rn2hryQ269o3OR5Mf9GrsuRXFs03luomo9jTswLxJ/68PrpUveLaR5bUuZIlQI5IV9bp2vgH0cgirQjl+ZLvr3zDr4n7+yppJs/9+Xv8fmKfA+/5YXhUa33HfpgqquZ9IszUWbjOZO1WvPH28ecGnN50biNu2MFdmb6Ab9bNO4apm/2o3xY7tQZMffHHDCk08lTMTfG/Dygz5nun7zW9HG6E3t0zGedBNJs33zouyzm8AHvyF+aglg503myA7sVjZtCiwd4qf9hzDUxqwa8L3fJ+2/b5e5VMY+U3bhdIM0WxFwac37M7n06SqxpimJdXkT12/y8s47p8+lkIn+eYV1VvRxzesxLMWfNZsOygWyTKjw3n4KOT9t38UVvyJdhy/K/G4a089I67MqYu2L26PHp5Il8Otk45NN0WrinvxNJfy+yqZ+BNJtXNN75S7N/iedvzUeG5TmK9wZ0lChrbsy9+SjZrQ9iFsXUKvK9zcuzYrYbdhNI88L2lHwKOjNm56bHJvMaIkWR3oL+dQSuktIi/YGYAzvYdlM+nTxasfg71otAmu2ZF7ZzcxCr8/pi1KRT6a0x18XsVPLomC69b67A6aTSgYybdPX2UMxxbZ6zJp9O1o7jDvBmXXufFI0bien9is0tj23Mi/UF4xqHQMpfjTwWc3DM0/l08mDReO9k6bisNZxiemefIV6SDz6Qer3uR45TDAJBIAgEgSAQBIJAEIhdgEAQCAJBIAgEgSAQBAICQSAIBIEgEASCQBAIAgGBIBAEgkAQCAJBIAgEgYBAEAgCQSAIBIEgEASCQEAgCASBIBAEgkAQCAJBICAQBIJAEAgCQSAIBIEgEBAIAkEgCASBIBAEgkAQCAgEgSAQBIJAEAgCQSD8n/0nwAAItM3a/60kmgAAAABJRU5ErkJggg==');
			}
			& .bottom{
				-webkit-mask-image: url('data:image/png;base64,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UmVhZHlxyWU8AAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RkZFQ0JFODgxRjMxMUU5ODBDOUU3MTQwRTlGQTU3MCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RkZFQ0JFNzgxRjMxMUU5ODBDOUU3MTQwRTlGQTU3MCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MDNDMzQxRDgxRTgxMUU5OTA5QUU3MzBERjVCNTdGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MDNDMzQxRTgxRTgxMUU5OTA5QUU3MzBERjVCNTdGNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmYzs30AAAS7SURBVHja7Np/qN1zHMfx7900zBLjZsQkkV8ra8tYiYbr+rG0P/wh/8jPReZXCm2U8iNJEclvEVEjyo8Rf2htNkn5kW7846+l/WFoSMb1/nQ+p063c8+v+733nPPt8ahXW9u9Z/fc+7zfH+duZHJysoDpzPMpQCAIBIEgEASCQBAIAgGBIBAEgkAQCAJBIAgEgYBAEAgCQSAIBIEgEASCQEAgCASBIBAEgkAQCAJBICAQBIJAEAgCQSAIBIEgEBAIAkEgCASBIBAEgkAQCAgEgSAQBIJAEAgCQSAIBASCQBAIAkEgCASBIBAEAgJBIAgEgSAQBIJAEAgCAYEgEASCQBAIAkEgCAT227Nzp88CjiAIhPKdJpBqWR77KLZ/CY91QOx1gVTDIbEnY1/ExmKrS3jMh2PLBDL8lwhXx36M3ZRuOvKfXzLDxx2PbXANMtxWxLbFXogdPuXvLprB447GXoqNCGQ4HRZ7Op9OzpzmbU6JLe3hsUdycEvcxQzn6eT62ERsfQdfu15OM+lx17rNHT6rYukVzWeanE5aXUd0Ix11Hm1WJYMrxfB8bHtsZZfvu6aL290FsddiCwUyPKeTG2M/xK7p8eu0KHZOh2/7YOz06T4QBstZsS9jT8UOneFjjXXwNufFbm9ValUdGztxiD7eI/LtZbp1XV7SY7a7UE13RK/Ub2mrHsiCfN59JPZN7KfYt7EHYgcO8MedXtzakO9Ormr1xerBSbHjWvz9c7Gj2p3r7o8dP6RRHB27NrY5tjv2aezO2LKGaO7JoYwN4Md/dj6dPF7UXi6fDdPdzVwXW9f2hZFfduyYjF/Ttuai3or9NcDfbavzkx7PF1bdfMe9Ebst9nOfn8eR+Uh3ZclHjGbej1065c/Sqfer2EGdBtLot9ibsZdjnw9AFEsaghgr4cLt19jdsWdj//XpdHJf7OA5+jf/jC2O/d1wVN3W6W1zs0AafRd7Md8j756jJzQ/dkZR+3lC2opZ+i5L8a/P1ytz4dyi9hPXU/vwTXZh7OP8+4did3X6ju0Cqfsn9kE+BW2J/VvyExjNR4d6FIvn6BO3L/ZYvg77Y5b+jXQRmF6hvKKPR+F0jXNrjvST/E1YaiCNdsVezaegiR4/4Hn5yDCez48r+3xHle54bo69V/Jd1S2xe4vai1b9NJGv3b6OHdPNO/YSSKOt+RSU7iL2tnnbdFS4IHZxPkqMDuBF8Ob8Rd01w8c5P/ZE7OQBem6fFZ2/slpaIHV78yc3nYK21x8732Wko8TafF0xvxh8v8c2FrVXMru9iF2aTyeXFxVRViBTD2fpFmpN0fD/CoZQen3ihvxcOjmd3JFfc1lUVMhsBFIl+/Kdx6YWp9DxfDo5oYqfAD+sa/+6Rbr6/z52WZPTyduxD6sah0A6l67834m9m2PYmE+l66r+xJ1icARBIAgEgSAQBIJAEAgIBIEgEASCQBAIAkEgCAQEgkAQCAJBIAgEgSAQBAICQSAIBIEgEASCQBAIAgGBIBAEgkAQCAJBIAgEgYBAEAgCQSAIBIEgEASCQEAgCASBIBAEgkAQCAJBICAQBIJAEAgCQSAIBIEgEBAIAkEgCASBIBAEgkAQCAiEXv0vwACtNKcH2VSWVgAAAABJRU5ErkJggg==');
			}
			&.destroy{
				.front{
					animation: cardDestroyFrontTrue 2s ease-in 0s forwards;
					@keyframes cardDestroyFrontTrue{
						0%, 70%, 100%{
							filter: brightness(100%) contrast(100%) saturate(100%) sepia(0%);
						}
						50%{
							filter: brightness(140%) contrast(200%) saturate(200%) sepia(100%);
						}
					}
				}
				.top{
					animation: cardDestroyTop 1s ease-in 1.1s forwards;
					@keyframes cardDestroyTop{
						0%{
							transform: translate(0, 0) rotateZ(0deg);
						}
						20%{
							transform: translate(2upx, -6upx) rotateZ(0deg);
						}
						100%{
							transform: translate(2upx, -6upx) rotateZ(55deg);
						}
					}
				}
				.bottom{
					animation: cardDestroyBottom 1s ease-in 1.1s forwards;
					@keyframes cardDestroyBottom{
						0%{
							transform: translate(0, 0) rotateZ(0deg);
						}
						20%{
							transform: translate(-2upx, 6upx) rotateZ(0deg);
						}
						100%{
							transform: translate(-2upx, 6upx) rotateZ(-10deg);
						}
					}
				}
			}
		}
	}
</style>
