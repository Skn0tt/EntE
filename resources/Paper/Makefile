open: Paper.pdf
	open Paper.pdf

Paper.pdf: Paper.md Paper.bib DB.png Use.png Activity.png eisvogel.latex Screenshot-entries.png Entschuldigungszettel.pdf
	pandoc Paper.md -o Paper.pdf \
		--template eisvogel \
		--listings \
		--filter pandoc-citeproc

DB.png: DB.plantuml
	plantuml DB.plantuml

Use.png: Use.plantuml
	plantuml Use.plantuml

Activity.png: Activity.plantuml
	plantuml Activity.plantuml
