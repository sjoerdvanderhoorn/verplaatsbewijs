var verplaatsbewijs =
{
	data:
	{
		databasecontrole: false,
		code: [],
		status: []
	},
	databasecontrole: function(uitslag)
	{
		verplaatsbewijs.data.databasecontrole = uitslag;
	},
	inlezen: function()
	{
		try
		{
			var regex_href = /verplaatsbewijs\.nl\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\//;
			var regex_hash = /^#([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)(?:\/((?:[0-9]{4})(?:[a-zA-Z]{2})(?:[0-9]{0,4})(?:[a-zA-Z]{0,3})))(?:\/((?:[0-9]{4})(?:[a-zA-Z]{2})(?:[0-9]{0,4})(?:[a-zA-Z]{0,3})))?(?:\/((?:[0-9]{4})(?:[a-zA-Z]{2})(?:[0-9]{0,4})(?:[a-zA-Z]{0,3})))?(?:\/((?:[0-9]{4})(?:[a-zA-Z]{2})(?:[0-9]{0,4})(?:[a-zA-Z]{0,3})))?(?:\/((?:[0-9]{4})(?:[a-zA-Z]{2})(?:[0-9]{0,4})(?:[a-zA-Z]{0,3})))?/;
			// Verwerk gegevens uit URL
			verplaatsbewijs.data.naam = document.location.hash.match(regex_hash)[3];
			verplaatsbewijs.data.adressen = document.location.hash.match(regex_hash).splice(4);
			verplaatsbewijs.data.code.uitnodiging = document.location.href.match(regex_href)[1];
			verplaatsbewijs.data.code.code1 = document.location.hash.match(regex_hash)[1];
			verplaatsbewijs.data.code.code2 = document.location.href.match(regex_href)[2];
			verplaatsbewijs.data.code.willekeurig = document.location.hash.match(regex_hash)[2];
		}
		catch(e)
		{
			verplaatsbewijs.data.status.push("Niet alle gegevens kunnen uitgelezen worden.");
		}
					console.log(verplaatsbewijs);
	},
	valideer: function()
	{
		try
		{
			// Databasecontrole
			if (verplaatsbewijs.data.databasecontrole !== true)
			{
				verplaatsbewijs.data.status.push("De gegevens van het Verplaatsbewijs komen niet overeen met wat bekend is uit de database.");
			}
			// Controleer Code 1
			if (verplaatsbewijs.data.code.code1 !== verplaatsbewijs.genereer.code1())
			{
				verplaatsbewijs.data.status.push("De opgegeven naam correspondeerd niet met de naam die is gebruikt tijdens het maken van het Verplaatsbewijs.");
			}
			// Controleer Code 2
			if (verplaatsbewijs.data.code.code2 !== verplaatsbewijs.genereer.code2())
			{
				verplaatsbewijs.data.status.push("Er heeft een ongeauthoriseerde aanpassing plaatsgevonden aan de naam of adressen.");
			}
		}
		catch(e)
		{
			verplaatsbewijs.data.status.push("Er hebben ongeauthoriseerde aanpassingen plaatsgevonden.");
		}
	},
	aanmaken: function(gegevens, succes, fout)
	{
		verplaatsbewijs.data.code.willekeurig = verplaatsbewijs.genereer.willekeurig();
		verplaatsbewijs.data.code.uitnodiging = gegevens.uitnodiging;
		verplaatsbewijs.data.naam = gegevens.naam;
		verplaatsbewijs.data.adressen = gegevens.adressen;
		verplaatsbewijs.data.code.code1 = verplaatsbewijs.genereer.code1();
		verplaatsbewijs.data.code.code2 = verplaatsbewijs.genereer.code2();
		// Maak verbinding met de database en stuur de volgende gegevens op:
		// - Uitnodigingscode
		// - Code 1
		// - Code 2
		// De database zal eerst controleren of Uitnodigingscode en Code 1 met elkaar overeenkomen. Zo ja, dan zal Code 2 opgeslagen worden.
		if (/* Vervang dit door een verbinding met een database. */ window.confirm("Deze melding wordt in de definitieve implementatie vervangen door een databaseverbindig.\n\nVoor nu, klik 'OK' als je wilt dat de database aangeeft dat Uitnodigingscode en Code 1 met elkaar overeen komen en dat Code 2 juist opgeslagen is, of klik 'Annuleren' wanneer de database bijvoorbeeld een onjuiste Uitnodigingscode en Code 1 combinatie heeft gedetecteerd."))
		{
			succes(verplaatsbewijs.genereer.link());
		}
		else
		{
			fout("De ingevoerde Uitnodigingscode komt niet overeen met de volledige voor- en achternaam zoals geschreven op het identiteitsbewijs.");
		}
	},
	genereer:
	{
		willekeurig: function()
		{
			// Dient vervangen te worden door een methode die een daadwerkelijk willekeurige waarde kan genereren.
			return sha512_256("" + Math.random());
		},
		code1: function()
		{
			return sha512_256(
				verplaatsbewijs.data.code.uitnodiging + 
				verplaatsbewijs.data.naam
			);
		},
		code2: function()
		{
			return sha512_256(
				verplaatsbewijs.data.code.code1 + 
				verplaatsbewijs.data.naam + 
				verplaatsbewijs.data.adressen.join("") + 
				verplaatsbewijs.data.code.willekeurig
			);
		},
		link: function()
		{
			return "https://www.verplaatsbewijs.nl/" + 
				verplaatsbewijs.data.code.uitnodiging + "/" + 
				verplaatsbewijs.data.code.code2 + "/#" + 
				verplaatsbewijs.data.code.code1 + "/" + 
				verplaatsbewijs.data.code.willekeurig+ "/" + 
				verplaatsbewijs.data.naam + "/" + 
				verplaatsbewijs.data.adressen.join("/");
		}
	}
}