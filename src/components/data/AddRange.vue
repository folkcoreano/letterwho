<script setup>
import supabase from "@/supabase";
import axios from "axios";
import {ref, watchEffect} from "vue";

const ranges = ref([]);
const supcrew = ref([]);
const catcrew = ref([]);

const list = [
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Eigth",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
	"Thirteen",
	"Fourteen",
	"Fifteen",
	"Sixteen",
	"Seventeen",
	"Eighteen",
	"Nineteen",
	"Twenty",
	"Twenty-One",
	"Twenty-Two",
	"Twenty-Three",
	"Twenty-Four",
	"Twenty-Five",
	"Twenty-Six",
];

for (const sea of list) {
	ranges.value.push({
		range_id: "season-" + sea.toLowerCase().replaceAll(" ", "-"),
		range: "season-" + sea.toLowerCase().replaceAll(" ", "-"),
		title: "Season " + sea,
		type: "tv",
	});
}

const episodes = [
	{
		story_id: "TV167",
		title: "The Christmas Invasion",
		released: "2005-12-25",
		length: 59,
		resume: {
			en: "It's Christmas Eve and high above London, the alien Sycorax are holding the Earth for ransom. The Tenth Doctor must recover from his regeneration in time to save the human race from slavery.",
			pt: "O Doutor acabou regenerado e Rose fica muito desconfiada de sua nova aparência, não acreditando que ele é o verdadeiro Doutor. Ela pode aprender a confiar nele ou poderá optar por deixar o Tardis e voltar para Londres.",
		},
	},
	{
		story_id: "TV168",
		title: "New Earth",
		released: "2006-04-15",
		length: 44,
		resume: {
			en: "The Doctor and Rose arrive on New Earth and meet old friends and enemies in a hospital which can cure every disease. But the cures come at a terrible cost.",
			pt: "O Doutor e Rose embarcam na Tardis para novas aventuras no tempo e espaço. Ao visitar a nova casa da humanidade, num futuro distante, eles descobrem segredos horripilantes escondidos em um hospital de luxo.",
		},
	},
	{
		story_id: "TV169",
		title: "Tooth and Claw",
		released: "2006-04-22",
		length: 45,
		resume: {
			en: "The Doctor and Rose are transported to 19th Century Scotland, where they meet Queen Victoria, and try to protect her from a ravenous werewolf and a band of assassinating warrior-monks",
			pt: "O Doutor e Rose viajam na Tardis ao século 19, na Escócia, e devem proteger a Rainha Vitória de um voraz lobisomem e de um grupo de monges guerreiros, liderados pelo padre Angelo.",
		},
	},
	{
		story_id: "TV170",
		title: "School Reunion",
		released: "2006-04-29",
		length: 44,
		resume: {
			en: "The Krillitanes - aliens with a mix-and-match physiology - are trying to crack the 'God-Maker', a paradigm to give them ultimate power. They are using children as a computer, and only the Doctor and Rose, re-united with Sarah Jane Smith and K9 can prevent them from becoming masters of time and space.",
			pt: "O Doutor investiga um colega dos tempos de escola que está sendo assombrado. Dentro do colégio, ele encontra sua velha amiga Sarah Jane Smith trabalhando disfarçada. Agora, ambos têm antigas contas a acertar.",
		},
	},
	{
		story_id: "TV171",
		title: "The Girl in the Fireplace",
		released: "2006-05-06",
		length: 45,
		resume: {
			en: "The Doctor, Mickey and Rose land on a spaceship in the 51st century only to find 18th century Versailles on board, the time of Madame De Pompadour! To find out what's going on the Doctor must enter Versailles and save Madame De Popmpadour but it turns into an emotional roller coaster for the Doctor.",
			pt: "O Doutor viaja até a França do século 18 para encontrar o amor e também uns androides malignos. Madame Pompadour, a amante do rei Luis XV, é perseguida pelos assassinos do relógio e por um misterioso ser que se esconde nas sombras.",
		},
	},
	{
		story_id: "TV172.1",
		title: "Rise of the Cybermen",
		released: "2006-05-13",
		length: 46,
		resume: {
			en: "The TARDIS crash lands in London on a parallel world, where Rose's dad is still alive, people are disappearing off the streets and one of the Doctor's deadliest enemies is about to be reborn.",
			pt: "A Tardis fica presa em uma terra paralela e Rose descobre que seu pai ainda está vivo. Enquanto isso, forças sinistras se unem e a sociedade britânica é preparada para um desenvolvimento definitivo.",
		},
	},
	{
		story_id: "TV172.2",
		title: "The Age of Steel",
		released: "2006-05-20",
		length: 46,
		resume: {
			en: "The Cybermen take control of London as the population is enslaved and the Doctor and his friends become fugitives.",
			pt: "Os Cybermen tomam Londres e começam a converter a população. Com Jackie sob o controle de Lumic, o Doutor, Rose e Mickey veem num ataque à fábrica sua última e desesperada chance.",
		},
	},
	{
		story_id: "TV173",
		title: "The Idiot's Lantern",
		released: "2006-05-27",
		length: 45,
		resume: {
			en: "As the coronation of Elizabeth II nears, the streets of London live in fear. Faceless people are stolen from their homes in the night and something evil is lurking in the television.",
			pt: "A coroação da Rainha Elizabeth II acontece em 1953. Além das celebrações, há rumores de haver enigmáticas criaturas nas ruas.",
		},
	},
	{
		story_id: "TV174.1",
		title: "The Impossible Planet",
		released: "2006-06-03",
		length: 45,
		resume: {
			en: "When the Doctor and Rose become stranded on a planet orbiting a black hole, they find a human expedition crew and their servants, the Ood, being terrorised by the Devil.",
			pt: "Rose está na órbita de um Buraco Negro, presa com uma Expedição da Terra e com o misterioso Ood. Mas os viajantes do tempo encaram um perigo ainda maior quando algo muito antigo sob a superfície do planeta começa a acordar.",
		},
	},
	{
		story_id: "TV174.2",
		title: "The Satan Pit",
		released: "2006-06-10",
		length: 47,
		resume: {
			en: "The Doctor risks his life to investigate the pit and is forced to make a terrible decision, while Rose and the crew fend for their lives against the Legion of the Beast.",
			pt: "Rose e a equipe da Expedição da Terra lutam contra o Ood, enquanto o Doutor tenta salvar o universo.",
		},
	},
	{
		story_id: "TV175",
		title: "Love & Monsters",
		released: "2006-06-17",
		length: 45,
		resume: {
			en: "Elton Pope is an ordinary man intrigued by the world of the Doctor. When he and fellow enthusiasts - L.I.N.D.A. - meet the mysterious Victor Kennedy, their lives will never be the same again.",
			pt: "Elton, um homem comum, fica obcecado por Doutor, Rose e sua misteriosa caixa azul. Quando suas investigações atraem a atenção do frio, enigmático e poderoso Victor Kennedy, esse passatempo inofensivo vira um inferno.",
		},
	},
	{
		story_id: "TV176",
		title: "Fear Her",
		released: "2006-06-24",
		length: 44,
		resume: {
			en: "When children vanish into thin air in 2012 London, the Doctor and Rose find the answers in a seemingly ordinary household and a girl whose drawings can come to life.",
			pt: "Quando a Tardis aterrissa em 2012, o Doutor decide mostrar a Rose as Olimpíadas de Londres. Mas, em uma casa próxima àquela região, uma mãe desesperada esconde os poderes sobrenaturais de sua filha.",
		},
	},
	{
		story_id: "TV177.1",
		title: "Army of Ghosts",
		released: "2006-07-01",
		length: 43,
		resume: {
			en: "When ghosts of loved ones appear all over the world the Doctor traces the phenomena to the Torchwood Tower, where some old friends and enemies are waiting.",
			pt: "A raça humana se regozija quando fantasmas de pessoas queridas voltam para casa. Mas, quando o Doutor, Rose e Jackie investigam a Torre Torchwood, surge uma ameaça de invasão em todo o planeta.",
		},
	},
	{
		story_id: "TV177.2",
		title: "Doomsday",
		released: "2006-07-08",
		length: 46,
		resume: {
			en: "Earth becomes a battleground for the Daleks and the Cybermen. With the whole planet at stake and the Genesis Ark activated, how much will the Doctor sacrifice in order to end the war?",
			pt: "O fim de uma jornada chega quando dois exércitos declaram guerra sobre a terra, com a raça humana envolvida. Enquanto o terror emerge, o Doutor enfrenta um dilema: salvar o mundo pode significar a morte de Rose Tyler.",
		},
	},
];

const epBatch = ref([]);

for (const ep of episodes) {
	let code = ep.story_id;
	let url = ep.title.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");
	epBatch.value.push({
		story_id: code,
		code: code,
		quote: code,
		url: url,
		reviews_id: url,
		diary_id: url,
		range_id: "series-two",
		type: "tv",
		title: ep.title,
		released: ep.released,
		length: ep.length,
		resume: ep.resume,
	});
}
const load = ref(false);
const crew = ref([]);
const crewBatch = ref([]);

function addRange() {
	supabase
		.from("crew")
		.insert(crewBatch.value)
		.then(res => {
			console.log(res);
		});
}

function organize() {
	for (const director of catcrew.value) {
		if (supcrew.value.some(e => e.crew_id === director.crew_id)) {
		} else {
			crewBatch.value.push({
				crew_id: director.crew_id,
				name: director.name,
				updated: new Date().toISOString(),
			});
		}
	}
	console.log(crewBatch.value);
}

supabase
	.from("crew")
	.select("crew_id")
	.then(res => {
		supcrew.value = res.data;
	});

// axios.get("https://api.catalogopolis.xyz/v1/writers").then(res => {
// 	for (const dir of res.data) {
// 		catcrew.value.push({
// 			crew_id: dir.name.toLowerCase().replaceAll(" ", "-").replaceAll("'", ""),
// 			name: dir.name,
// 			updated: new Date().toISOString(),
// 		});
// 	}
// });
</script>
<template>
	<button @click="addRange">add</button>
	<button @click="organize">organize</button>
</template>
