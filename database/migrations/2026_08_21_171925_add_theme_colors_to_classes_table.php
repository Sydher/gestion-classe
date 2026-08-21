<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->string('couleur_tertiaire', 7)->default('#F5F5F4')->after('couleur_secondaire');
            $table->string('couleur_texte', 7)->default('#292524')->after('couleur_tertiaire');
        });

        // Give any classe created before this migration a coordinated
        // tertiary/text pair instead of leaving them on the generic default.
        DB::table('classes')->update([
            'couleur_tertiaire' => '#F6F1FB',
            'couleur_texte' => '#2E1A47',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropColumn(['couleur_tertiaire', 'couleur_texte']);
        });
    }
};
