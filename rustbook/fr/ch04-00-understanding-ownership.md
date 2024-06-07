<!--
# Understanding Ownership
-->

# Comprendre la possession

<!--
Ownership is Rust’s most unique feature and has deep implications for the rest
of the language. It enables Rust to make memory safety guarantees without
needing a garbage collector, so it’s important to understand how ownership
works. In this chapter, we’ll talk about ownership as well as several related
features: borrowing, slices, and how Rust lays data out in memory.
-->

La possession (*ownership*) est la fonctionnalité la plus remarquable de Rust,
et a des implications en profondeur dans l'ensemble du langage. Elle permet à
Rust de garantir la sécurité de la mémoire sans avoir besoin d'un
ramasse-miettes (*garbage collector*), donc il est important de comprendre
comment la possession fonctionne. Dans ce chapitre, nous aborderons la
possession, ainsi que d'autres fonctionnalités associées : l'emprunt, les
*slices* et la façon dont Rust agence les données en mémoire.
